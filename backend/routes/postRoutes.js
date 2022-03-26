const express = require('express');
const database = require('../database');
const { isAuthorized, upload } = require('../middlewares');
const s3 = require('../aws/aws-s3');
const router = express.Router();

router.put('/dislike', isAuthorized, (req, res) => {
	database
		.dislikePost(req.query.id, req.session.user)
		.then((result) => {
			if (result) {
				return res.json({ data: result });
			}
		})
		.catch((err) => res.sendStatus(500));
});

router.put('/like', isAuthorized, (req, res) => {
	database
		.likePost(req.query.id, req.session.user)
		.then((result) => {
			if (result) {
				console.log(result);
				return res.json({ data: result });
			}
		})
		.catch((err) => res.sendStatus(500));
});

router.delete('/comment', isAuthorized, (req, res) => {
	database
		.deleteComment(req.body.commentId)
		.then((result) => {
			if (result.deletedCount) {
				return res.sendStatus(200);
			}
		})
		.catch((err) => res.sendStatus(500));
});

router.post('/comment', isAuthorized, (req, res) => {
	database
		.postComment(
			req.body.comment,
			req.body.postId,
			req.session.user,
			req.body.recipient
		)
		.then((commentDoc) => {
			if (commentDoc) {
				return res.json({ data: commentDoc });
			}
		})
		.catch((err) => res.sendStatus(500));
});

router.get('/all', isAuthorized, (req, res) => {
	database
		.getAllPosts(req.session.user)
		.then((posts) => res.json({ posts }))
		.catch((err) => res.sendStatus(500));
});

router.delete('/', isAuthorized, (req, res) => {
	database
		.deletePost(req.query.id)
		.then((result) => {
			if (result[0].deletedCount) {
				return res.sendStatus(200);
			}
		})
		.catch((err) => res.sendStatus(500));
});

router.post('/', isAuthorized, upload.single('file'), (req, res) => {
	console.log(req.body.caption);
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

router.get('/', isAuthorized, (req, res) => {
	database
		.getPost(req.query.id)
		.then((result) => {
			console.log(result);
			if (result.length) {
				return res.json(result);
			}

			return res.sendStatus(204);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(500);
		});
});
module.exports = router;
