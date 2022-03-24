const express = require('express');
const database = require('../database');
const { isAuthorized, upload } = require('../middlewares');
const s3 = require('../aws/aws-s3');
const router = express.Router();

router.get('/following', isAuthorized, (req, res) => {
	database
		.getFollowing(req.session.user)
		.then((following) => {
			return res.json({ data: following });
		})
		.catch((err) => res.sendStatus(500));
});

router.get('/followers', isAuthorized, (req, res) => {
	database
		.getFollowers(req.session.user)
		.then((followers) => {
			return res.json({ data: followers });
		})
		.catch((err) => res.sendStatus(500));
});

router.get('/post', isAuthorized, (req, res) => {
	database
		.getUserPosts(req.session.user)
		.then((posts) => {
			res.json({ posts });
		})
		.catch((err) => res.sendStatus(500));
});

router.put('/profilePhoto', isAuthorized, upload.single('file'), (req, res) => {
	s3.uploadPhoto(req.session.user, req.file, req.file.originalname)
		.then((filePath) => {
			database
				.editProfilePhoto(req.session.user, filePath)
				.then((result) => {
					if (result.modifiedCount) {
						return res.json({ profilePhoto: filePath });
					}
				})
				.catch((err) => res.sendStatus(500));
		})
		.catch((err) => res.sendStatus(500));
});

router.delete('/profilePhoto', isAuthorized, (req, res) => {
	s3.deletePhoto(req.body.profilePhoto)
		.then(() => {
			database
				.editProfilePhoto(req.session.user)
				.then((result) => {
					if (result.modifiedCount) {
						return res.sendStatus(200);
					}
				})
				.catch((err) => res.sendStatus(500));
		})
		.catch((err) => res.sendStatus(500));
});

router.get('/', isAuthorized, (req, res) => {
	database
		.getUser(req.session.user)
		.then((result) => {
			return res.json({ data: result });
		})
		.catch((err) => res.sendStatus(500));
});

module.exports = router;
