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

	return (
		<main>
			<Card>
				<CardHeader title='Forgot Password' />
				<CardContent>
					<TextField placeholder='Username' />
					<TextField placeholder='Password' type='password' />
				</CardContent>
				<CardActions>
					<Button onClick={() => navigate('/', { replace: true })}>
						Click here to go back
					</Button>
				</CardActions>
			</Card>
		</main>
	);
}
