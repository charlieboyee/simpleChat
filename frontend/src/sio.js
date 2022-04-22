import { io } from 'socket.io-client';

const sio = (userData, setAllMessages) => {
	const socket = io();

	socket.on('connect', () => {
		console.log(`Client ${socket.id} connected`);
		socket.auth = { username: userData.username };
	});

	socket.on('userConnected', (data) => {
		console.log(data);
	});

	socket.on('joinRoom', (data) => {
		console.log(`User ${data.user} has joined ${data.room}`);
	});

	socket.on('leaveRoom', (data) => {
		console.log(`User ${data.user} has left ${data.room}`);
	});

	socket.on('connect_error', (err) => {
		console.log(err);
		socket.auth = { username: userData.username };
		socket.connect();
	});
	return socket;
};

export default sio;
