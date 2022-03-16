import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorizedRoutes from './routes/authorized';
import UnauthorizedRoutes from './routes/unauthorized';
import { LoggedInContext } from './index';
import './App.css';

export default function App() {
	const navigate = useNavigate();
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		(async () => {
			const result = await fetch('/api');
			if (result.status === 200) {
				setLoggedIn(true);
				return;
			}
			setLoggedIn(false);
			navigate('/', { replace: true });
			return;
		})();
	}, []);

	if (loggedIn) {
		return (
			<LoggedInContext.Provider value={[loggedIn, setLoggedIn]}>
				<AuthorizedRoutes />
			</LoggedInContext.Provider>
		);
	}
	return (
		<LoggedInContext.Provider value={[loggedIn, setLoggedIn]}>
			<UnauthorizedRoutes />
		</LoggedInContext.Provider>
	);
}
