require('dotenv').config();
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const database = require('./database').runDb();
const api = require('./routes/api');
const app = express();

app.use('/', api);

app.listen(process.env.PORT, () => {
	console.log(`Connected to port ${process.env.PORT}`);
});
