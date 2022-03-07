import { useNavigate } from 'react-router-dom';
import {
	Card,
	CardActions,
	CardHeader,
	TextField,
	Button,
	CardContent,
} from '@mui/material';
import './design/Landing.css';

export default function Landing() {
	const navigate = useNavigate();
	return (
		<div id='landing'>
			<h1>Simple Chat</h1>
			<main>
				<Card>
					<CardHeader title='Login' />
					<CardContent>
						<TextField label='Username' placeholder='Username' />
						<TextField
							label='Password'
							placeholder='Password'
							type='password'
						/>
						<Button>Log In</Button>
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
