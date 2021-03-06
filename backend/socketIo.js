module.exports = (io, database) => {
	//Where to store socket ids?
	// Why in a db and not just in memory.
	// If the sever reboots and you lose the memory you also won’t have any sockets anyway.
	// If they are in a db you will have bad socket Id after a reboot.
	//Unless you're running multiple instances, just keep it in memory.
	//If it crashes, the connections will be dropped and re-established anyways.

	let users = {};

	io.use((socket, next) => {
		const username = socket.handshake.auth.username;

		if (!username) return next(new Error('invalid username'));

		socket.username = username;
		users[socket.username] = socket.id;

		return next();
	});

	return io.on('connection', (socket) => {
		socket.broadcast.emit('userConnected', `${socket.username}, ${socket.id}`);

		socket.on('joinRoom', (data) => {
			socket.join(data.room);
			socket.broadcast.to(data.room).emit('joinRoom', data);
		});

		socket.on('leaveRoom', (data) => {
			socket.leave(data.room);
			socket.broadcast.to(data.room).emit('leaveRoom', data);
		});

		socket.on('notifyUser', (participants) => {
			participants.forEach((user) => {
				if (user !== socket.username) {
					socket.to(users[user]).emit('notifyUser', participants);
				}
			});
		});

		socket.on('sendMessage', (messageObj) => {
			socket.to(messageObj.to).emit('receiveSentMessage', messageObj);
		});

		socket.on('disconnect', () => {
			console.log(`${socket.id} disconnected`);
		});
	});
};
