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
	return prom;
};

const createAccount = async (user) => {
	let result = await users.findOne({ username: user.username });
	if (result) return result;
	const hash = await bcrypt.hash(user.password, saltRounds);
	result = users.insertOne({
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
		likes: 0,
		comments: [],
		owner: user,
	};

	const result = await posts.insertOne(post);
	return result;
};

const deleteComment = async (postId, commentId) => {
	console.log(postId);
	const update = { $pull: { comments: { _id: new ObjectId(commentId) } } };
	const options = { returnDocument: 'after' };
	const result = await posts.findOneAndUpdate(
		{ _id: new ObjectId(postId) },
		update,
		options
	);
	console.log(result);
	return result;
};

const editProfilePhoto = async (user, filePath = '') => {
	const update = {
		$set: { profilePhoto: filePath },
	};
	const result = await users.updateOne({ username: user }, update);
	return result;
};

const getAllUsers = async () => {
	const projection = { username: 1, _id: 0 };
	const result = await users.find({}).project(projection);
	const cursor = await result.toArray();
	return cursor;
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
	];

	const agg = await posts.aggregate(pipeline);
	const cursor = await agg.toArray();
	return cursor;
};

const getFollowing = async (username) => {
	const user = await users.findOne(
		{ username },
		{ projection: { following: 1 } }
	);
	const pipeline = [
		{
			$match: {
				username: { $in: [...user.following] },
			},
		},
	];

	const cursor = await users.aggregate(pipeline);
	const result = await cursor.toArray();
	return result;
};

const getFollowers = async (username) => {
	const user = await users.findOne(
		{ username },
		{ projection: { followers: 1 } }
	);
	const pipeline = [
		{
			$match: {
				username: { $in: [...user.followers] },
			},
		},
	];

	const cursor = await users.aggregate(pipeline);
	const result = await cursor.toArray();
	return result;
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
const logIn = async (user) => {
	let result = await users.findOne({ username: user.username });
	if (!result) return result;
	const match = await bcrypt.compare(user.password, result.password);
	if (!match) return match;
	const access_token = jwt.sign(user.username, process.env.ACCESS_SECRET);
	return access_token;
};

const postComment = async (comment, postId, user) => {
	const commentObj = {
		_id: new ObjectId(),
		owner: user,
		comment,
		inception: new Date(),
	};
	const update = { $push: { comments: { $each: [commentObj], $position: 0 } } };
	const options = { returnDocument: 'after' };
	const result = await posts.findOneAndUpdate(
		{ _id: new ObjectId(postId) },
		update,
		options
	);

	return result;
};
const runDb = async () => {
	try {
		await client.connect();
		let db = await client.db('simpleChat');
		users = db.collection('users');
		posts = db.collection('posts');
		console.log('connected to db');
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	addFollower,
	createAccount,
	createPost,
	deleteComment,
	editProfilePhoto,
	getAllUsers,
	getAllPosts,
	getFollowing,
	getFollowers,
	getUser,
	getUserPosts,
	postComment,
	logIn,
	runDb,
};
