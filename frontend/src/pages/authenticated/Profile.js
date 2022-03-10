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
	const { userData, userPosts } = useOutletContext();
	const [ownerData, setOwnerData] = userData;
	const [ownerPosts, setOwnerPosts] = userPosts;
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		console.log(ownerData);
	}, []);

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
				body: JSON.stringify({ profilePhoto: ownerData.profilePhoto }),
			});

			let formData = new FormData();
			formData.append('file', e.target.files[0]);

			const result = await fetch('/api/user/profilePhoto', {
				method: 'PUT',
				body: formData,
			});

			if (result.status === 200) {
				const { profilePhoto } = await result.json();

				setOwnerData({ ...ownerData, profilePhoto });
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
			setOwnerData({ ...ownerData, profilePhoto });

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
			body: JSON.stringify({ profilePhoto: ownerData.profilePhoto }),
		});
		if (result.status === 200) {
			console.log('successfully delted');
			setModalOpen(false);
			setOwnerData({ ...ownerData, profilePhoto: '' });
			return;
		}
	};

	return (
		<main id='profile'>
			<section id='upperSection'>
				<Card>
					<CardMedia>
						{ownerData.profilePhoto ? (
							<IconButton
								onClick={handleModalOpen}
								disableRipple
								component='span'
							>
								<Avatar
									src={`${process.env.REACT_APP_S3_URL}${ownerData.profilePhoto}`}
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
					<CardContent>
						<div>
							<span>{ownerData.username}</span>
							<Button variant='contained'>Edit Profile</Button>
						</div>
						<div>
							<span>{ownerPosts.length} posts</span>
							<span>{ownerData.following.length} following</span>
							<span>{ownerData.followers.length} followers</span>
						</div>
					</CardContent>
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
