import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
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
	Tab,
	Tabs,
} from '@mui/material';
import './design/profile.css';

function TabPanel(props) {
	const { value, index, children } = props;
	return (
		<div className='tabPanel' hidden={value !== index}>
			{children}
		</div>
	);
}

export default function Profile() {
	const { userData } = useOutletContext();
	const [ownerData, setOwnerData] = userData;

	const [modalOpen, setModalOpen] = useState(false);
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (e, newValue) => setTabValue(newValue);

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
									id='profilePhoto'
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
									<Avatar id='profilePhoto' />
								</IconButton>
							</label>
						)}
					</CardMedia>
					<CardContent>
						<div>
							<div>
								<span>{ownerData.username}</span>
								<Button variant='contained'>Edit Profile</Button>
							</div>
							<div>
								<span>{ownerData.posts?.length} posts</span>
								<span>{ownerData.following?.length} following</span>
								<span>{ownerData.followers?.length} followers</span>
							</div>
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
			<section id='lowerSection'>
				<Tabs centered value={tabValue} onChange={handleTabChange}>
					<Tab label='Photos' />
					<Tab label='Videos' />
				</Tabs>
				<TabPanel value={tabValue} index={0}>
					{ownerData.posts?.map((post, index) => {
						return (
							<img
								key={index}
								src={`${process.env.REACT_APP_S3_URL}${post.photo}`}
								alt='post'
							/>
						);
					})}
				</TabPanel>
				<TabPanel value={tabValue} index={1}>
					videos
				</TabPanel>
			</section>
		</main>
	);
}
