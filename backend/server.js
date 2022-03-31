require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();

const session = require('express-session');
const database = require('./database');

const { Server, Socket } = require('socket.io');
const { createServer } = require('http');
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (sock) => {
	console.log(`Server socket ${sock.id}`);
	app.set('socket', sock);
	sock.on('message', (message) => {
		console.log(message);
	});
	sock.on('disconnect', () => {
		console.log(`${sock.id} disconnected`);
	});
});

let RedisStore = require('connect-redis')(session);
const { createClient } = require('redis');
let redisClient = createClient({ legacyMode: true });
redisClient.connect().catch((err) => console.log(err));

redisClient.on('connect', () => {
	console.log('Redis connected');
});
const api = require('./routes.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('io', io);

let minute = 1000 * 60;

database.runDb().then(() => {
	app.use(
		session({
			store: new RedisStore({ client: redisClient }),
			secret: 'jjong',
			resave: false,
			genid: () => {
				return uuidv4(); // use UUIDs for session IDs
			},
			cookie: {
				httpOnly: true,
				maxAge: minute * 60,
			},
			saveUninitialized: false,
		})
	);
	app.use('/api', api);

	httpServer.listen(process.env.PORT, () => {
		console.log(`Connected to port ${process.env.PORT}`);
	});
});
