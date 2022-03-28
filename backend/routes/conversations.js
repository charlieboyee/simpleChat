const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/', (req, res) => {
	res.json({ hi });
});
module.exports = router;
