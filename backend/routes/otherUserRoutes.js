const express = require('express');
const database = require('../database');
const { isAuthorized, upload } = require('../middlewares');
const s3 = require('../aws/aws-s3');
const router = express.Router();

router.get('/:user/data', (req, res) => {
	console.log(req.params);
	database
		.getUserData(req.params.user)
		.then((result) => {
			return res.json({ data: result });
		})
		.catch((err) => res.sendStatus(500));
});

router.get('/:user/posts', (req, res) => {
	console.log(req.params);
	database
		.getUserPosts(req.params.user)
		.then((result) => {
			return res.json({ data: result });
		})
		.catch((err) => res.sendStatus(500));
});

module.exports = router;
