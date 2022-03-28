const express = require('express');
const database = require('../database');
const { isAuthorized, upload } = require('../middlewares');
const s3 = require('../aws/aws-s3');
const router = express.Router();
router.use(isAuthorized);
router.post('/:user/follow', (req, res) => {
	database
		.addFollower(req.params.user, req.body.follower)
		.then((result) => {
			if (result[0].ok && result[1].ok) {
				return res.json({ data: [result[0].value, result[1].value] });
			}
		})
		.catch((err) => res.sendStatus(500));
});

router.get('/:user', (req, res) => {
	Promise.all([
		database.getUser(req.params.user),
		database.getUserPosts(req.params.user),
	])
		.then((result) => {
			if (!result[0]) {
				return res.json({ data: false });
			}
			res.json({ data: result });
		})
		.catch((err) => res.sendStatus(500));
});
module.exports = router;
