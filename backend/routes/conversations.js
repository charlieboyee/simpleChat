const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const bcrypt = require('bcrypt');
const router = express.Router();

router.use(isAuthorized);
router.put('/', (req, res) => {
	database
		.createConversation(req.body.selectedUsers, req.session.user)
		.then((result) => {
			if (result.acknowledged) res.sendStatus(200);
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});

router.get('/', (req, res) => {
	database
		.getConversations(req.session.user)
		.then((result) => {
			console.log(result);
			res.json({ data: result });
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(500);
		});
});
module.exports = router;
