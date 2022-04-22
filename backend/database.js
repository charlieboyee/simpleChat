const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPW}@cluster0.tc23e.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

let users;
let posts;
let notifications;
let comments;
let conversations;

const runDb = async () => {
	try {
		await client.connect();
		let db = await client.db('simpleChat');
		users = db.collection('users');
		posts = db.collection('posts');
		comments = db.collection('comments');
		notifications = db.collection('notifications');
		conversations = db.collection('conversations');
		console.log('connected to db');
	} catch (error) {
		console.log(error);
	}
};

const addFollower = async (user, follower) => {
	const options = { returnDocument: 'after' };

	const update = { $addToSet: { followers: follower } };
	const result = users.findOneAndUpdate({ username: user }, update, options);

	const update2 = { $addToSet: { following: user } };
	const result2 = users.findOneAndUpdate(
		{ username: follower },
		update2,
		options
	);

	const prom = await Promise.all([result, result2]);
	if (prom[0].lastErrorObject.n && prom[1].lastErrorObject.n) {
		notifications.insertOne({
			sender: follower,
			recipient: user,
			inception: new Date(),
			type: 'following',
			read: false,
		});
		return prom;
	}
	return null;
};

const changeReadStatus = async (id) => {
	const query = { _id: new ObjectId(id) };
	const update = { $set: { read: true } };
	const result = await notifications.updateOne(query, update);
	if (result.modifiedCount) {
		return true;
	}
	return null;
};

const createAccount = async (user) => {
	let result = await users.findOne({ username: user.username });
	if (result) return result;
	const hash = await bcrypt.hash(user.password, saltRounds);
	result = await users.insertOne({
		username: user.username,
		password: hash,
		inception: new Date(),
		followers: [],
		following: [],
		profilePhoto: '',
	});
	return result;
};

const createPost = async (user, filePath, caption = '') => {
	const post = {
		photo: filePath,
		inception: new Date(),
		caption,
		likes: [],
		owner: user,
	};

	const result = await posts.insertOne(post);
	return result;
};

const deleteComment = async (commentId) => {
	const query = { _id: new ObjectId(commentId) };
	const result = await comments.deleteOne(query);
	return result;
};

const deletePost = async (postId) => {
	const query = { _id: new ObjectId(postId) };
	const query2 = { postRef: new ObjectId(postId) };
	const prom = posts.deleteOne(query);
	const prom2 = comments.deleteMany(query2);
	const results = await Promise.all([prom, prom2]);
	return results;
};

const dislikePost = async (postId, liker) => {
	const query = {
		_id: new ObjectId(postId),
	};
	const update = {
		$pull: { likes: { $in: [liker] } },
	};
	const options = {
		returnDocument: 'after',
	};
	const result = await posts.findOneAndUpdate(query, update, options);
	if (result.lastErrorObject.n) {
		return result.value;
	}
	return null;
};

const editProfilePhoto = async (user, filePath = '') => {
	const update = {
		$set: { profilePhoto: filePath },
	};
	const result = await users.updateOne({ username: user }, update);
	return result;
};

const getAllConversations = async (user) => {
	const pipeline = [
		{
			$match: {
				participants: {
					$in: ['charoo'],
				},
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'participants',
				foreignField: 'username',
				as: 'participants',
			},
		},
	];
	const cursor = await conversations.aggregate(pipeline);

	const result = await cursor.toArray();
	return result;
};

const getAllPosts = async (username) => {
	const user = await users.findOne(
		{ username },
		{ projection: { following: 1 } }
	);
	const pipeline = [
		{
			$match: {
				owner: { $in: [...user.following, username] },
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'owner',
				foreignField: 'username',
				as: 'owner',
			},
		},
		{
			$lookup: {
				from: 'comments',
				localField: '_id',
				foreignField: 'postRef',
				as: 'comments',
			},
		},

		{ $sort: { inception: -1 } },
	];

	const cursor = await posts.aggregate(pipeline);
	const result = await cursor.toArray();
	return result;
};

const getAllUsers = async (user) => {
	const query = { username: { $ne: user } };
	const projection = { username: 1, profilePhoto: 1, _id: 0 };

	const result = await users.find(query).project(projection);
	const cursor = await result.toArray();
	return cursor;
};

const getConversation = async (convoId) => {
	const query = { _id: new ObjectId(convoId) };
	const result = await conversations.findOne(query);
	return result;
};

const getFollowing = async (username) => {
	const pipeline = [
		{
			$match: {
				username,
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'following',
				foreignField: 'username',
				as: 'following',
			},
		},
	];

	const cursor = await users.aggregate(pipeline);
	const result = await cursor.toArray();
	return result;
};

const getFollowers = async (username) => {
	const pipeline = [
		{
			$match: {
				username,
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'followers',
				foreignField: 'username',
				as: 'followers',
			},
		},
	];

	const cursor = await users.aggregate(pipeline);
	const result = await cursor.toArray();
	return result;
};

const getPost = async (postId, notiId) => {
	const nullPipe = [
		{
			$match: {
				_id: new ObjectId(postId),
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'owner',
				foreignField: 'username',
				as: 'owner',
			},
		},
		{
			$group: {
				_id: '$$CURRENT',
			},
		},
	];
	const pipeline = [
		{
			$match: {
				_id: new ObjectId(postId),
			},
		},
		{
			$lookup: {
				from: 'comments',
				localField: '_id',
				foreignField: 'postRef',
				as: 'comments',
			},
		},
		{
			$unwind: {
				path: '$comments',
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'comments.owner',
				foreignField: 'username',
				as: 'comments.owner',
			},
		},
		{
			$group: {
				_id: {
					_id: '$_id',
					photo: '$photo',
					caption: '$caption',
					owner: '$owner',
					likes: '$likes',
				},
				postComments: {
					$push: '$comments',
				},
			},
		},
	];

	notifications.updateOne(
		{ _id: new ObjectId(notiId) },
		{ $set: { read: true } }
	);

	const cursor = await posts.aggregate(pipeline);
	const result = await cursor.toArray();
	if (result.length) {
		return result;
	}

	const cursor2 = await posts.aggregate(nullPipe);
	const result2 = await cursor2.toArray();
	if (result2.length) {
		return result2;
	}
	return [];
};

const getUser = async (user) => {
	const result = await users.findOne({ username: user });
	return result;
};

const getUserPosts = async (user) => {
	const cursor = await posts.find({ owner: user }).sort({ inception: -1 });
	const result = await cursor.toArray();
	return result;
};

const getUserNotifications = async (user) => {
	const pipeline = [
		{ $match: { recipient: user } },
		{
			$lookup: {
				from: 'users',
				localField: 'sender',
				foreignField: 'username',
				as: 'sender',
			},
		},
		{ $sort: { inception: -1 } },
	];
	const cursor = await notifications.aggregate(pipeline);
	const result = await cursor.toArray();

	return result;
};

const getUserNotificationCount = async (user) => {
	const result = await notifications.countDocuments({
		recipient: user,
		read: false,
	});
	return result;
};

const likePost = async (postId, liker) => {
	const query = { _id: new ObjectId(postId) };
	const update = { $addToSet: { likes: liker } };
	const options = { returnDocument: 'after' };
	const result = await posts.findOneAndUpdate(query, update, options);

	if (result.lastErrorObject.n) {
		notifications.insertOne({
			sender: liker,
			recipient: result.value.owner,
			inception: new Date(),
			type: 'like',
			read: false,
			postRef: new ObjectId(postId),
		});
		return result.value;
	}
	return null;
};
const logIn = async (user) => {
	let result = await users.findOne({ username: user.username });
	if (!result) return result;
	const match = await bcrypt.compare(user.password, result.password);
	if (!match) return match;
	const access_token = jwt.sign(user.username, process.env.ACCESS_SECRET);
	return access_token;
};

const postComment = async (comment, postId, user, recipient) => {
	const commentDoc = {
		_id: new ObjectId(),
		owner: user,
		comment,
		inception: new Date(),
		postRef: ObjectId(postId),
	};

	const result = await comments.insertOne(commentDoc);
	if (result.acknowledged && result.insertedId) {
		notifications.insertOne({
			sender: user,
			recipient,
			inception: new Date(),
			type: 'comment',
			read: false,
			postRef: ObjectId(postId),
		});
		const updatedDoc = await comments.findOne({ _id: result.insertedId });
		return updatedDoc;
	}
	return null;
};

const removeFollower = async (user, userToRemove) => {
	const query = { username: user };
	const update = { $pull: { followers: userToRemove } };
	const options = { returnDocument: 'after' };
	const prom = users.findOneAndUpdate(query, update, options);

	const query2 = { username: userToRemove };
	const update2 = { $pull: { following: user } };
	const prom2 = users.findOneAndUpdate(query2, update2, options);

	const result = await Promise.all([prom, prom2]);
	if (result[0].lastErrorObject.n && result[1].lastErrorObject.n) {
		return result[0].value;
	}
	return null;
};

const storeMessage = async (messageObj, participants) => {
	if (messageObj.to) {
		const query = { _id: new ObjectId(messageObj.to) };
		delete messageObj.to;

		const options = { returnDocument: 'after' };
		const update = { $push: { messages: messageObj } };

		const result = await conversations.findOneAndUpdate(query, update, options);
		if (result.lastErrorObject.n) {
			return result.value.messages[result.value.messages.length - 1];
		}
		return null;
	}
	const result = await conversations.insertOne({
		inception: messageObj.timeStamp,
		participants,
		messages: [messageObj],
	});
	if (result.acknowledged && result.insertedId) {
		const newConvo = await conversations.findOne({ _id: result.insertedId });
		return newConvo;
	}
	return null;
};

const unFollow = async (user, userToUnfollow) => {
	const query = { username: user };
	const update = { $pull: { following: userToUnfollow } };
	const options = { returnDocument: 'after' };
	const prom = users.findOneAndUpdate(query, update, options);

	const query2 = { username: userToUnfollow };
	const update2 = { $pull: { followers: user } };
	const prom2 = users.findOneAndUpdate(query2, update2, options);

	const result = await Promise.all([prom, prom2]);
	if (result[0].lastErrorObject.n && result[1].lastErrorObject.n) {
		return result[0].value;
	}
	return null;
};

module.exports = {
	addFollower,
	changeReadStatus,
	createAccount,
	createPost,
	deleteComment,
	deletePost,
	dislikePost,
	editProfilePhoto,
	getAllUsers,
	getAllPosts,
	getAllConversations,
	getConversation,
	getUserNotifications,
	getUserNotificationCount,
	getFollowing,
	getFollowers,
	getPost,
	getUser,
	getUserPosts,
	likePost,
	logIn,
	postComment,
	removeFollower,
	runDb,
	storeMessage,
	unFollow,
};
