const express = require('express');
const database = require('../database');
const { isAuthorized } = require('../middlewares');
const bcrypt = require('bcrypt');
const router = express.Router();

router.put('/', (req, res) => {
	database.createConversation(req.body.selectedUsers, req.sessions.user);
});
module.exports = router;
