import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorizedRoutes from './routes/authorized';
import UnauthorizedRoutes from './routes/unauthorized';
import { LoggedInContext, SocketContext } from './index';
import './App.css';
import { io } from 'socket.io-client';

export default function App() {
	const navigate = useNavigate();

	const [loggedIn, setLoggedIn] = useState(false);

	const [socket, setSocket] = useState(null);

	const controller = new AbortController();
	const signal = controller.signal;

	useEffect(() => {
		if (socket) {
			socket.on('connect', () => {
				console.log('connected');
			});
		}
	}, [socket]);
	useEffect(() => {
		setSocket(io());
		(async () => {
			const result = await fetch('/api', { signal });
			if (result.status === 200) {
				setLoggedIn(true);
				return;
			}
			setLoggedIn(false);
			navigate('/', { replace: true });
			return;
		})();
		return () => {
			controller.abort();
		};
	}, []);

	if (loggedIn) {
		return (
			<LoggedInContext.Provider value={[loggedIn, setLoggedIn]}>
				<SocketContext.Provider value={socket}>
					<AuthorizedRoutes />
				</SocketContext.Provider>
			</LoggedInContext.Provider>
		);
	}
	return (
		<LoggedInContext.Provider value={[loggedIn, setLoggedIn]}>
			<UnauthorizedRoutes />
		</LoggedInContext.Provider>
	);
}
