import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Card,
	CardActions,
	CardHeader,
	TextField,
	Button,
	CardContent,
} from '@mui/material';
import { LoggedInContext } from '../../index';
import './design/landing.css';

export default function Landing() {
	const navigate = useNavigate();
	const [loggedIn, setLoggedIn] = useContext(LoggedInContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);

	const handleUsernameChange = (e) => {
		setError(false);
		setUsername(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setError(false);
		setPassword(e.target.value);
	};

	const logIn = async (e) => {
		e.preventDefault();

		const result = await fetch('/api/logIn', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});
		if (result.status === 200) {
			const { status } = await result.json();
			if (status) {
				setLoggedIn(true);
				return;
			}
			setError(true);
			return;
		}
	};

	return (
		<main id='landing'>
			<h1>Simple Chat</h1>
			<Card raised>
				<CardHeader title='Login' />
				<CardContent>
					<form onSubmit={logIn}>
						<TextField
							required
							error={error}
							onChange={handleUsernameChange}
							placeholder='Username'
						/>
						<TextField
							required
							error={error}
							onChange={handlePasswordChange}
							placeholder='Password'
							type='password'
							helperText={error && 'Username or password incorrect.'}
						/>
						<Button type='submit'>Log In</Button>
					</form>
				</CardContent>
				<CardActions>
					<Button onClick={() => navigate('createAccount')}>
						Don't have an account? Click here.
					</Button>
					<Button onClick={() => navigate('forgotPassword')}>
						Forgot password? Click here.
					</Button>
				</CardActions>
			</Card>
		</main>
	);
}
