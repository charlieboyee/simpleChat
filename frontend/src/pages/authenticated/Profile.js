import { useRef, useState } from 'react';
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
import { useEffect } from 'react';

export default function Profile() {
	const [userData, setUserData] = useOutletContext();
	const [photoToUpload, setPhotoToUpload] = useState('');
	const profilePhotoRef = useRef();

	const changeProfilePhoto = (e) => {
		e.preventDefault();
		console.log('hiii');
		// const result = await fetch('/api/user/profilePhoto', {
		// 	method: 'PUT',
		// 	headers:{
		// 		'content-type': 'application/json'
		// 	},
		// 	body: JSON.stringify()
		// })
	};

	useEffect(() => {
		if (photoToUpload) {
			profilePhotoRef.current.requestSubmit();
		}
	});

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
							<form ref={profilePhotoRef} onSubmit={changeProfilePhoto}>
								<label htmlFor='uploadProfilePhoto'>
									<Input
										sx={{ display: 'none' }}
										accept='image/*'
										id='uploadProfilePhoto'
										type='file'
										onChange={(e) => setPhotoToUpload(e.target.files[0])}
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
