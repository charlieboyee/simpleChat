const bcrypt = require('bcrypt');
const saltRounds = 10;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPW}@cluster0.tc23e.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

let users;

const createAccount = async (user) => {
	let result = await users.findOne({ username: user.username });
	if (result) return result;
	const hash = await bcrypt.hash(user.password, saltRounds);
	result = users.insertOne({
		username: user.username,
		password: hash,
		inception: Date(),
		friends: [],
	});
	return result;
};

const logIn = async (user) => {
	let result = await users.findOne({ username: user.username });
	if (!result) return result;
	const match = await bcrypt.compare(user.password, result.password);
	if (!match) return match;
	return true;
};
const runDb = async () => {
	try {
		await client.connect();
		let db = await client.db('simpleChat');
		users = db.collection('users');
		console.log('connected to db');
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	createAccount,
	logIn,
	runDb,
};
