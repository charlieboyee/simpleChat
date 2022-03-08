import { useOutletContext } from 'react-router-dom';
import {
	Card,
	CardMedia,
	CardContent,
	IconButton,
	Avatar,
} from '@mui/material';
import './design/profile.css';

export default function Profile() {
	const [userData, setUserData] = useOutletContext();
	return (
		<main>
			<section id='upperSection'>
				<Card>
					<CardMedia>
						<IconButton>
							<Avatar />
						</IconButton>
					</CardMedia>
					<CardContent></CardContent>
				</Card>
			</section>
			<section id='lowerSection'></section>
		</main>
	);
}
