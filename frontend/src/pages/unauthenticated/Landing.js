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
	return (
		<main>
			<h1>Simple Chat</h1>
			<main>
				<Card>
					<CardHeader title='Login' />
					<CardContent>
						<TextField placeholder='Username' />
						<TextField placeholder='Password' type='password' />
					</CardContent>
					<CardActions>
						<Button>Don't have an account? Click here.</Button>
						<Button>Forgot password? Click here.</Button>
					</CardActions>
				</Card>
			</main>
		</main>
	);
}
