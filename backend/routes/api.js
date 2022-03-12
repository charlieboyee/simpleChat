const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const bcrypt = require('bcrypt');
const userRoute = require('./userRoutes');
const postsRoutes = require('./postsRoutes');
const router = express.Router();

router.use('/posts', postsRoutes);
router.use('/user', userRoute);

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
