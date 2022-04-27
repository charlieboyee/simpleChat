const express = require('express');
const database = require('../database');
const { isAuthorized, upload } = require('../middlewares');
const s3 = require('../aws/aws-s3');
const router = express.Router();

router.use(isAuthorized);

router.put('/dislike', (req, res) => {
	database
		.dislikePost(req.query.id, req.session.user)
		.then((result) => {
			if (result) {
				return res.json({ data: result });
			}
		})
		.catch((err) => res.sendStatus(500));
});

router.put('/like', (req, res) => {
	database
		.likePost(req.query.id, req.session.user)
		.then((result) => {
			if (result) {
				return res.json({ data: result });
			}
		})
		.catch((err) => res.sendStatus(500));
});

router.delete('/comment', (req, res) => {
	database
		.deleteComment(req.body.commentId)
		.then((result) => {
			if (result.deletedCount) {
				return res.sendStatus(200);
			}
		})
		.catch((err) => res.sendStatus(500));
});

router.post('/comment', (req, res) => {
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

router.get('/all', (req, res) => {
	database
		.getAllPosts(req.session.user)
		.then((posts) => res.json({ posts }))
		.catch((err) => res.sendStatus(500));
});

router.delete('/', (req, res) => {
	database
		.deletePost(req.query.id)
		.then((result) => {
			if (result[0].deletedCount) {
				return res.sendStatus(200);
			}
		})
		.catch((err) => res.sendStatus(500));
});

router.post('/', upload.single('file'), (req, res) => {
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
				.catch((err) => {
					console.log(err);
					res.sendStatus(500);
				});
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(500);
		});
});

router.get('/', (req, res) => {
	database
		.getPost(req.query.postId, req.query.notiId)
		.then((result) => {
			if (result.length) {
				return res.json(result);
			}

			return res.sendStatus(204);
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});
module.exports = router;
