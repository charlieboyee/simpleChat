const express = require('express');
const database = require('../database');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/test', (req, res) => {
	res.json({ data: 'hi' });
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
