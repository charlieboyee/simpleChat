const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPW}@cluster0.tc23e.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

let users;

const runDb = async () => {
	try {
		console.log(process.env.DBUSER);
		await client.connect();
		let db = await client.db('simpleChat');
		users = db.collection('users');
		console.log('connected to db');
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	runDb,
};
