import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Card,
	CardActions,
	CardHeader,
	TextField,
	Button,
	CardContent,
} from '@mui/material';

import './design/createAccount.css';

export default function CreateAccount() {
	const navigate = useNavigate();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [emailError, setEmailError] = useState(false);

	const createAccount = async (e) => {
		e.preventDefault();
		const result = await fetch('/api/createAccount', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ username, password, email }),
		});
		if (result.status === 200) {
			const data = await result.json();
			if (data.status) return navigate('/', { replace: true });
			switch (data.error) {
				case 'username':
					return setUsernameError(true);
				case 'email':
					return setEmailError(true);
				default:
					console.log('Error creating account.');
			}
			return;
		}
		console.log('there is an error');
		return;
	};

	const handleUsernameChange = (e) => {
		setUsernameError(false);
		setUsername(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPasswordError(false);
		setPassword(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmailError(false);
		setEmail(e.target.value);
	};

	return (
		<main id='createAccount'>
			<Card>
				<CardHeader title='Create Account' />
				<CardContent>
					<form onSubmit={createAccount}>
						<TextField
							required
							helperText={usernameError && 'User already exists'}
							error={usernameError}
							value={username}
							onChange={handleUsernameChange}
							placeholder='Username'
						/>
						<TextField
							required
							helperText={emailError && 'Email already in use'}
							error={emailError}
							value={email}
							onChange={handleEmailChange}
							placeholder='example@email.com'
							type='email'
						/>
						<TextField
							required
							error={passwordError}
							value={password}
							onChange={handlePasswordChange}
							placeholder='Password'
							type='password'
						/>
						<Button type='submit'>Create</Button>
					</form>
				</CardContent>
				<CardActions>
					<Button onClick={() => navigate('/', { replace: true })}>
						Already have an account? Click here.
					</Button>
				</CardActions>
			</Card>
		</main>
	);
}
