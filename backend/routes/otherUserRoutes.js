const express = require('express');
const database = require('../database');
const { isAuthorized, upload } = require('../middlewares');
const s3 = require('../aws/aws-s3');
const router = express.Router();

router.post('/:user/follow', isAuthorized, (req, res) => {
	console.log(req.params.user, req.body.follower);
	database
		.addFollower(req.params.user, req.body.follower)
		.then((result) => {
			if (result[0].ok && result[1].ok) {
				return res.json({ status: true });
			}
		})
		.catch((err) => res.sendStatus(500));
});

router.get('/:user/data', isAuthorized, (req, res) => {
	database
		.getUserData(req.params.user)
		.then((result) => {
			return res.json({ data: result });
		})
		.catch((err) => res.sendStatus(500));
});

router.get('/:user/posts', isAuthorized, (req, res) => {
	database
		.getUserPosts(req.params.user)
		.then((result) => {
			return res.json({ data: result });
		})
		.catch((err) => res.sendStatus(500));
});

module.exports = router;
