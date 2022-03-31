const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const router = express.Router();
router.use(isAuthorized);
router.get('/count', (req, res) => {
	database
		.getUserNotificationCount(req.session.user)
		.then((result) => {
			return res.json({ count: result });
		})
		.catch((err) => req.sendStatus(500));
});

router.get('/', (req, res) => {
	database
		.getUserNotifications(req.session.user)
		.then((result) => {
			return res.json({ notifications: result });
		})
		.catch((err) => req.sendStatus(500));
});

module.exports = router;
