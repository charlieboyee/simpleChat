import {
	Card,
	CardActions,
	CardHeader,
	TextField,
	Button,
	CardContent,
} from '@mui/material';
export default function CreateAccount() {
	return (
		<main>
			<Card>
				<CardHeader title='Create Account' />
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
	);
}
