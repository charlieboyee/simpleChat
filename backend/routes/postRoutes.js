const express = require('express');
const database = require('../database');
const { isAuthorized, upload } = require('../middlewares');
const s3 = require('../aws/aws-s3');
const router = express.Router();

router.post('/comment', isAuthorized, (req, res) => {
	database
		.postComment(req.body.comment, req.body.postId, req.session.user)
		.then((result) => {
			if (result.lastErrorObject.n) {
				console.log(result);
				return res.json({ data: result.value });
			}
			res.json({ data: result.value });
		})
		.catch((err) => res.sendStatus(500));
});
router.get('/allPosts', isAuthorized, (req, res) => {
	database
		.getAllPosts(req.session.user)
		.then((posts) => res.json({ posts }))
		.catch((err) => res.sendStatus(500));
});

router.post('/', isAuthorized, upload.single('file'), (req, res) => {
	s3.uploadPhoto(req.session.user, req.file, req.file.originalname)
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
