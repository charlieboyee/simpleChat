import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
	Avatar,
	Button,
	Card,
	CardMedia,
	CardContent,
	Input,
	IconButton,
	Modal,
	CardHeader,
	CardActions,
} from '@mui/material';
import './design/profile.css';

export default function Profile() {
	const [userData, setUserData] = useOutletContext();
	const [modalOpen, setModalOpen] = useState(false);

	const handleModalOpen = () => {
		setModalOpen(true);
	};
	const handleModalClose = () => {
		setModalOpen(false);
	};

	const changeProfilePhoto = async (e) => {
		e.preventDefault();
		try {
			await fetch('/api/user/profilePhoto', {
				method: 'DELETE',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({ profilePhoto: userData.profilePhoto }),
			});

			let formData = new FormData();
			formData.append('file', e.target.files[0]);

			const result = await fetch('/api/user/profilePhoto', {
				method: 'PUT',
				body: formData,
			});

			if (result.status === 200) {
				const { profilePhoto } = await result.json();

				setUserData({ ...userData, profilePhoto });
				setModalOpen(false);
				return;
			}
		} catch (err) {
			console.log(err);
		}
	};
	const uploadProfilePhoto = async (e) => {
		e.preventDefault();

		let formData = new FormData();
		formData.append('file', e.target.files[0]);

		const result = await fetch('/api/user/profilePhoto', {
			method: 'PUT',
			body: formData,
		});
		if (result.status === 200) {
			const { profilePhoto } = await result.json();
			console.log(profilePhoto);
			setUserData({ ...userData, profilePhoto });

			return;
		}
	};

	const removeProfilePhoto = async (e) => {
		e.preventDefault();
		const result = await fetch('/api/user/profilePhoto', {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ profilePhoto: userData.profilePhoto }),
		});
		if (result.status === 200) {
			console.log('successfully delted');
			setModalOpen(false);
			setUserData({ ...userData, profilePhoto: '' });
			return;
		}
	};

	return (
		<main>
			<section id='upperSection'>
				<Card>
					<CardMedia>
						{userData.profilePhoto ? (
							<IconButton
								onClick={handleModalOpen}
								disableRipple
								component='span'
							>
								<Avatar
									src={`${process.env.REACT_APP_S3_URL}${userData.profilePhoto}`}
								/>
							</IconButton>
						) : (
							<label htmlFor='uploadProfilePhoto'>
								<Input
									sx={{ display: 'none' }}
									accept='image/*'
									id='uploadProfilePhoto'
									type='file'
									onChange={(e) => uploadProfilePhoto(e)}
								/>

								<IconButton disableRipple component='span'>
									<Avatar />
								</IconButton>
							</label>
						)}
					</CardMedia>
					<CardContent></CardContent>
				</Card>
				<Modal onClose={handleModalClose} open={modalOpen}>
					<Card>
						<CardHeader title='Change Profile Photo' />
						<CardActions>
							<Input
								sx={{ display: 'none' }}
								accept='image/*'
								type='file'
								id='changeProfilePhoto'
								onChange={changeProfilePhoto}
							/>

							<Button htmlFor='changeProfilePhoto' component='label'>
								Change Photo
							</Button>
							<Button onClick={removeProfilePhoto} type='submit'>
								Remove Current Photo
							</Button>

							<Button onClick={handleModalClose}>Cancel</Button>
						</CardActions>
					</Card>
				</Modal>
			</section>
			<section id='lowerSection'></section>
		</main>
	);
}
