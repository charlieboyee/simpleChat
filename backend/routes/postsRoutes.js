const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const s3 = require('../aws/aws-s3');
const router = express.Router();

router.post('/64toBlob', isAuthorized, (req, res) => {
	res.send(req.body.croppedImg);
});
router.post('/', isAuthorized, (req, res) => {
	s3.uploadPhoto(
		req.session.user,
		req.body.croppedImg,
		req.body.croppedImg.name
	)
		.then((filePath) => {
			database
				.createPost(req.session.user, filePath, req.body.caption)
				.then((result) => {
					if (result.acknowledged) {
						return res.json({ status: true });
					}
					res.json({ status: false });
				})
				.catch((err) => res.sendStatus(500));
		})
		.catch((err) => res.sendStatus(500));
});

module.exports = router;
