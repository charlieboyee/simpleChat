import { useState, useEffect, useContext } from 'react';
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
import './design/Landing.css';

export default function Landing() {
	const navigate = useNavigate();
	const [loggedIn, setLoggedIn] = useContext(LoggedInContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	useEffect(() => {
		console.log(loggedIn);
	}, []);

	const handleUsernameChange = (e) => {
		setUsernameError(false);
		setUsername(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPasswordError(false);
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
				localStorage.setItem(status[0], status[1]);
				setLoggedIn(true);
				return;
			}
			setPasswordError(true);
			setUsernameError(true);
			return;
		}
	};

	return (
		<div id='landing'>
			<h1>Simple Chat</h1>
			<main>
				<Card>
					<CardHeader title='Login' />
					<CardContent>
						<form onSubmit={logIn}>
							<TextField
								required
								error={usernameError}
								onChange={handleUsernameChange}
								label='Username'
								placeholder='Username'
							/>
							<TextField
								required
								error={passwordError}
								onChange={handlePasswordChange}
								label='Password'
								placeholder='Password'
								type='password'
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
		</div>
	);
}
