require('dotenv').config();
const bcrypt = require('bcrypt');
const express = require('express');
const database = require('./database');
const api = require('./routes/api');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

database.runDb().then(({ users }) => {
	app.use('/api', api);

	app.get('/', (req, res) => {
		res.json({ data: 'this is the root route' });
	});

	app.listen(process.env.PORT, () => {
		console.log(`Connected to port ${process.env.PORT}`);
	});
});
