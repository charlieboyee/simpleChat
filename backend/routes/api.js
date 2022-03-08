const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/logOut', isAuthorized, (req, res) => {
	res.sendStatus(200);
});
router.post('/logIn', (req, res) => {
	database
		.logIn(req.body)
		.then((result) => {
			if (result) {
				req.session.token = result;
				return res.json({ status: [req.sessionID, result] });
			}
			res.json({ status: false });
		})
		.catch((err) => res.sendStatus(500));
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
		.catch((err) => res.sendStatus(500));
});

router.get('/', (req, res) => {
	res.json({ status: 'hello' });
});
module.exports = router;
