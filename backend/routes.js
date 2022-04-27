const express = require('express');
const database = require('./database');
const { isAuthorized } = require('./middlewares');
const bcrypt = require('bcrypt');
const routes = require('./routes/');
const sendMail = require('./nodeMailer');
const router = express.Router();

router.use('/conversations', routes.conversations);
router.use('/notifications', routes.notificationRoutes);
router.use('/otherUser', routes.otherUserRoutes);
router.use('/post', routes.postRoutes);
router.use('/user', routes.userRoute);

router.get('/allUsers', isAuthorized, (req, res) => {
	database
		.getAllUsers(req.session.user)
		.then((users) => res.json({ options: users }))
		.catch((err) => res.sendStatus(500));
});

router.put('/changePassword', (req, res) => {
	database
		.changePassword(req.body)
		.then((result) => {
			if (result) {
				return res.sendStatus(200);
			}
			return res.sendStatus(204);
		})
		.catch((err) => res.sendStatus(500));
});
router.post('/createAccount', (req, res) => {
	database
		.createAccount(req.body)
		.then((user) => {
			if (user.acknowledged) {
				sendMail(req.body, 'Account Created');
				return res.json({ status: true });
			}
			if (user.username === req.body.username) {
				return res.json({ status: false, error: 'username' });
			}
			if (user.email === req.body.email) {
				return res.json({ status: false, error: 'email' });
			}
		})
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
			return res.json({ status: false });
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(500);
		});
});

router.put('/sendVerificationCode', (req, res) => {
	sendMail(req.body, 'Code')
		.then((code) => {
			database
				.storeVerificationCode(req.body.email, code)
				.then((result) => {
					if (result) {
						return res.sendStatus(200);
					}
					return res.sendStatus(204);
				})
				.catch((err) => {
					return res.sendStatus(500);
				});
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});

router.put('/verifyCode', (req, res) => {
	database
		.verifyCode(req.body.email, req.body.code)
		.then((result) => {
			if (result) {
				return res.sendStatus(200);
			}
			return res.sendStatus(204);
		})
		.catch((err) => res.sendStatus(500));
});

router.get('/', isAuthorized, (req, res) => {
	res.sendStatus(200);
});

module.exports = router;
