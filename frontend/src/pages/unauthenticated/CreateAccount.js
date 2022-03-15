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

export default function CreateAccount() {
	const navigate = useNavigate();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const createAccount = async (e) => {
		e.preventDefault();
		const result = await fetch('/api/createAccount', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});
		if (result.status === 200) {
			const { status } = await result.json();
			if (status) return navigate('/', { replace: true });
			setUsernameError(true);
			return console.log('User already exists');
		}
		console.log('there is an error');
		return;
	};

	const handleUsernameChange = (e) => {
		setUsernameError(false);
		setUsername(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	return (
		<main>
			<Card>
				<CardHeader title='Create Account' />
				<CardContent>
					<form onSubmit={createAccount}>
						<TextField
							error={usernameError}
							value={username}
							onChange={handleUsernameChange}
							placeholder='Username'
						/>
						<TextField
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
