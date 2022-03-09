const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const s3 = require('../aws/aws-s3');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/data', isAuthorized, (req, res) => {
	database
		.getUserData(req.session.user)
		.then((result) => {
			if (!result) return res.json({ data: false });
			return res.json({ data: result });
		})
		.catch((err) => res.sendStatus(500));
});

router.put('/profilePhoto', isAuthorized, upload.single('file'), (req, res) => {
	//store into s3 bucket, get presigned, store url into db, return results
	s3.uploadPhoto(req.session.user, req.file, req.file.originalname)
		.then((filePath) => {
			database
				.editProfilePhoto(req.session.user, filePath)
				.then((result) => {
					return res.json({ modifiedCount: result.modifiedCount });
				})
				.catch((err) => res.sendStatus(500));
		})
		.catch((err) => res.sendStatus(500));
});

module.exports = router;
