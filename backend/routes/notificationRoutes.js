const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const router = express.Router();
router.use(isAuthorized);

router.get('/count', (req, res) => {
	database
		.getUserNotificationCount(req.session.user)
		.then((result) => {
			console.log(result);
			return res.json({ count: result });
		})
		.catch((err) => {
			console.log(err);
			req.sendStatus(500);
			return;
		});
});

router.put('/read', (req, res) => {
	console.log(req.query);
	database
		.changeReadStatus(req.query.id)
		.then((result) => {
			if (result) {
				return res.sendStatus(200);
			}
			res.sendStatus(204);
		})
		.catch((err) => res.sendStatus(500));
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
