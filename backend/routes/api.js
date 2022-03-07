const express = require('express');
const router = express.Router();

router.post('/createAccount', (req, res) => {
	res.json({ status: 'hello' });
});

router.get('/', (req, res) => {
	res.json({ status: 'hello' });
});
module.exports = router;
