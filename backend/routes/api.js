const express = require('express');
const database = require('../database');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/logIn', (req, res) => {
	console.log(req.body);
	database
		.logIn(req.body)
		.then((result) => {
			if (result) {
				return res.json({ status: true });
			}
			res.json({ status: false });
		})
		.catch((err) => res.status(500));
});

router.post('/createAccount', (req, res) => {
	database
		.createAccount(req.body)
		.then((user) => {
			if (user.acknowledged) {
				return res.json({ status: true });
			}
			res.json({ status: false });
		})
		.catch((err) => res.status(500));
});

router.get('/', (req, res) => {
	res.json({ status: 'hello' });
});
module.exports = router;
