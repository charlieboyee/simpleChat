require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const session = require('express-session');
const { Server } = require('socket.io');
const { createServer } = require('http');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const database = require('./database');
const api = require('./routes/api');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('io', io);

io.on('connection', (sock) => {
	console.log(`Server socket ${sock.id}`);
	app.set('socket', sock);
});
let minute = 1000 * 60;

database.runDb().then(() => {
	app.use(
		session({
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
