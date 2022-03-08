require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const session = require('express-session');
const database = require('./database');
const api = require('./routes/api');

const app = express();
app.use(
	session({
		secret: 'jjong',
		genid: () => {
			return uuidv4(); // use UUIDs for session IDs
		},
		cookie: {
			maxAge: 30000,
		},
		saveUninitialized: false,
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

database.runDb().then(() => {
	app.use('/api', api);

	app.get('/', (req, res) => {
		res.json({ data: 'this is the root route' });
	});

	app.listen(process.env.PORT, () => {
		console.log(`Connected to port ${process.env.PORT}`);
	});
});
