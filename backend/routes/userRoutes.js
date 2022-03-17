const express = require('express');
const database = require('../database');
const { isAuthorized, upload } = require('../middlewares');
const s3 = require('../aws/aws-s3');
const router = express.Router();

router.post('/post', isAuthorized, upload.single('file'), (req, res) => {
	s3.uploadPhoto(req.session.user, req.file, req.file.originalname)
		.then((filePath) => {
			database
				.createPost(req.session.user, filePath, req.body.caption)
				.then((result) => {
					console.log(result);
					if (result.acknowledged) {
						return res.json({ status: true });
					}
					res.json({ status: false });
				})
				.catch((err) => res.sendStatus(500));
		})
		.catch((err) => res.sendStatus(500));
});

router.put('/profilePhoto', isAuthorized, upload.single('file'), (req, res) => {
	console.log(req.file);
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
	//store into s3 bucket, get presigned, store url into db, return results
	console.log('hi');
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
