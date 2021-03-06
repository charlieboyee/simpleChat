const jwt = require('jsonwebtoken');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const isAuthorized = (req, res, next) => {
	if (!req.session.cookie || !req.session.token) {
		return res.sendStatus(401);
	}
	const token = req.session.token;
	return jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
		if (err || !decoded) return res.sendStatus(401);

		return next();
	});
};

module.exports = {
	isAuthorized,
	upload,
};
