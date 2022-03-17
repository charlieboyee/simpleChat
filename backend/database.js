const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
	console.log(prom);
	return prom;
};

const createAccount = async (user) => {
	let result = await users.findOne({ username: user.username });
	if (result) return result;
	const hash = await bcrypt.hash(user.password, saltRounds);
	result = users.insertOne({
		username: user.username,
		password: hash,
		inception: Date(),
		followers: [],
		following: [],
		profilePhoto: '',
	});
	return result;
};

const createPost = async (user, filePath, caption = '') => {
	const post = {
		photo: filePath,
		inception: Date(),
		caption,
		likes: 0,
		comments: [],
		owner: user,
	};

	const result = await posts.insertOne(post);
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
	const cursor = await posts
		.find({
			owner: { $in: [...user.following, username] },
		})
		.sort({ inception: -1 });
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
	editProfilePhoto,
	getAllUsers,
	getAllPosts,
	getUser,
	getUserPosts,
	logIn,
	runDb,
};
