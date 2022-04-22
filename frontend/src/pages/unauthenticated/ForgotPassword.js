import { useNavigate } from 'react-router-dom';

import {
	Card,
	CardActions,
	CardHeader,
	TextField,
	Button,
	CardContent,
} from '@mui/material';

import './design/forgotPassword.css';

export default function CreateAccount() {
	const navigate = useNavigate();

	return (
		<main id='forgotPassword'>
			<Card>
				<CardHeader title='Forgot Password' />
				<CardContent>
					<TextField placeholder='Username' />
					<TextField placeholder='Old password' type='password' />
					<TextField placeholder='New password' type='password' />
				</CardContent>
				<CardActions>
					<Button onClick={() => console.log('clicked')}>Reset password</Button>
					<Button onClick={() => navigate('/', { replace: true })}>
						Already have an account? Click here.
					</Button>
				</CardActions>
			</Card>
		</main>
	);
}
