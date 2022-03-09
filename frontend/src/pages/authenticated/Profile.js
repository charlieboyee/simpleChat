import { useOutletContext } from 'react-router-dom';
import {
	Card,
	CardMedia,
	CardContent,
	Input,
	IconButton,
	Avatar,
} from '@mui/material';
import './design/profile.css';

export default function Profile() {
	const [userData, setUserData] = useOutletContext();

	const changeProfilePhoto = () => {};
	return (
		<main>
			<section id='upperSection'>
				<Card>
					<CardMedia>
						{userData.profilePhoto ? (
							<IconButton>
								<Avatar />
							</IconButton>
						) : (
							<form onSubmit={changeProfilePhoto}>
								<label htmlFor='uploadProfilePhoto'>
									<Input
										sx={{ display: 'none' }}
										accept='image/*'
										id='uploadProfilePhoto'
										type='file'
									/>

									<IconButton disableRipple component='span'>
										<Avatar />
									</IconButton>
								</label>
							</form>
						)}
					</CardMedia>
					<CardContent></CardContent>
				</Card>
			</section>
			<section id='lowerSection'></section>
		</main>
	);
}
