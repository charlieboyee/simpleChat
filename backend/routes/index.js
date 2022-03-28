const userRoute = require('./userRoutes');
const notificationRoutes = require('./notificationRoutes');
const postRoutes = require('./postRoutes');
const otherUserRoutes = require('./otherUserRoutes');
const conversations = require('./conversations');

module.exports = {
	conversations,
	userRoute,
	notificationRoutes,
	postRoutes,
	otherUserRoutes,
};
