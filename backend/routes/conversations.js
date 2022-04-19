const express = require('express');
const s3 = require('../aws/aws-s3');
const database = require('../database');
const { isAuthorized, upload } = require('../middlewares');
const bcrypt = require('bcrypt');
const router = express.Router();

router.use(isAuthorized);

router.get('/conversation', (req, res) => {
	database
		.getConversation(req.query.id)
		.then((conversation) => res.json({ conversation }))
		.catch((err) => res.sendStatus(500));
});

router.post('/conversation', upload.single('file'), (req, res) => {
	if (!req.file) {
		return database
			.storeMessage(req.body.messageObj, req.body.participants)
			.then((result) => {
				if (result) {
					return res.sendStatus(200);
				}
				return res.sendStatus(204);
			})
			.catch((err) => res.sendStatus(500));
	}
	s3.uploadPhoto(req.session.user, req.file, req.file.originalname)
		.then((filePath) => {
			let messageObj = JSON.parse(req.body.messageObj);
			messageObj.message = filePath;
			database
				.storeMessage(messageObj, req.body.participants.split(','))
				.then((result) => {
					if (result) {
						return res.json({ data: result });
					}
					return res.sendStatus(204);
				})
				.catch((err) => res.sendStatus(500));
		})
		.catch((err) => res.sendStatus(500));
});

router.get('/', (req, res) => {
	database
		.getAllConversations(req.session.user)
		.then((result) => {
			res.json({ data: result });
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});
module.exports = router;
