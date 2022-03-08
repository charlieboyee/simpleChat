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

	const createAccount = async () => {
		const result = await fetch('/api/createAccount', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});
		if (result.status === 200) {
			const response = await result.json();
			console.log(response);
			return;
		}
		console.log('there is an error');
		return;
	};

	const handleUsernameChange = (e) => {
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
					<TextField
						value={username}
						onChange={handleUsernameChange}
						placeholder='Username'
					/>
					<TextField
						value={password}
						onChange={handlePasswordChange}
						placeholder='Password'
						type='password'
					/>
					<Button onClick={createAccount}>Create</Button>
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
