const express = require('express');
const database = require('../database');
const { isAuthorized, upload } = require('../middlewares');
const s3 = require('../aws/aws-s3');
const router = express.Router();

router.use(isAuthorized);

router.put('/removeFollower/:user', (req, res) => {
	database
		.removeFollower(req.session.user, req.params.user)
		.then((result) => {
			if (result) {
				return res.json({ data: result });
			}
			return res.sendStatus(204);
		})
		.catch((err) => res.sendStatus(500));
});
router.get('/following', (req, res) => {
	database
		.getFollowing(req.session.user)
		.then((following) => {
			return res.json({ data: following });
		})
		.catch((err) => res.sendStatus(500));
});

router.get('/followers', (req, res) => {
	database
		.getFollowers(req.session.user)
		.then((followers) => {
			return res.json({ data: followers });
		})
		.catch((err) => res.sendStatus(500));
});

router.get('/post', (req, res) => {
	database
		.getUserPosts(req.session.user)
		.then((posts) => {
			res.json({ posts });
		})
		.catch((err) => res.sendStatus(500));
});

router.put('/profilePhoto', upload.single('file'), (req, res) => {
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

router.delete('/profilePhoto', (req, res) => {
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

router.get('/', (req, res) => {
	database
		.getUser(req.session.user)
		.then((result) => {
			return res.json({ data: result });
		})
		.catch((err) => res.sendStatus(500));
});

module.exports = router;
