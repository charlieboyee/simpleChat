const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const bcrypt = require('bcrypt');
const router = express.Router();

router.use(isAuthorized);

router.get('/conversation', (req, res) => {
	database
		.getConversation(req.query.id)
		.then((conversation) => res.json({ conversation }))
		.catch((err) => res.sendStatus(500));
});

router.post('/', (req, res) => {
	database
		.storeMessage(req.body, req.session.user)
		.then((result) => {
			if (result) {
				return res.json({ data: result.toString() });
			}
			return res.sendStatus(204);
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});

router.get('/', (req, res) => {
	database
		.getAllConversations(req.session.user)
		.then((result) => {
			res.json({ data: result });
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});
module.exports = router;
