const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const bcrypt = require('bcrypt');
const userRoute = require('./userRoutes');
const notificationRoutes = require('./notificationRoutes');
const postRoutes = require('./postRoutes');
const otherUserRoutes = require('./otherUserRoutes');
const router = express.Router();

router.use('/user', userRoute);
router.use('/notifications', notificationRoutes);
router.use('/otherUser', otherUserRoutes);
router.use('/post', postRoutes);

router.get('/allUsers', isAuthorized, (req, res) => {
	database
		.getAllUsers()
		.then((users) => res.json({ options: users }))
		.catch((err) => res.sendStatus(500));
});

router.post('/logOut', isAuthorized, (req, res) => {
	req.session.destroy();
	res.sendStatus(200);
});

router.post('/logIn', (req, res) => {
	database
		.logIn(req.body)
		.then((result) => {
			if (result) {
				req.session.token = result;
				req.session.user = req.body.username;
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

router.get('/', isAuthorized, (req, res) => {
	res.sendStatus(200);
});

module.exports = router;
