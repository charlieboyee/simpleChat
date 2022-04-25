import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorizedRoutes from './routes/authorized';
import UnauthorizedRoutes from './routes/unauthorized';
import { LoggedInContext, SocketContext } from './index';
import './App.css';
import Loading from './components/Loading';

export default function App() {
	const navigate = useNavigate();

	const [loggedIn, setLoggedIn] = useState(false);
	const [socket, setSocket] = useState(null);
	const [loading, setLoading] = useState(false);

	const controller = new AbortController();
	const signal = controller.signal;

	useEffect(() => {
		setLoading(true);
		(async () => {
			const result = await fetch('/api', { signal });
			if (result.status === 200) {
				setTimeout(() => {
					setLoggedIn(true);
					setLoading(false);
				}, 1500);
			}
			if (result.status !== 200) {
				setTimeout(() => {
					setLoggedIn(false);
					navigate('/', { replace: true });
					setLoading(false);
				}, 1500);
			}
			return;
		})();
		return () => {
			controller.abort();
		};
	}, []);

	if (loading) {
		return <Loading />;
	}
	if (loggedIn) {
		return (
			<LoggedInContext.Provider value={[loggedIn, setLoggedIn]}>
				<SocketContext.Provider value={[socket, setSocket]}>
					<AuthorizedRoutes loading={loading} setLoading={setLoading} />
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
