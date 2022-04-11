const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const bcrypt = require('bcrypt');
const router = express.Router();

router.use(isAuthorized);

router.get('/', (req, res) => {
	database
		.getConversations(req.session.user)
		.then((result) => {
			res.json({ data: result });
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});
module.exports = router;
