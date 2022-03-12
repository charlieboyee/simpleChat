const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const s3 = require('../aws/aws-s3');
const router = express.Router();

router.post('/', isAuthorized, (req, res) => {
	s3.uploadPhoto();
});

module.exports = router;
