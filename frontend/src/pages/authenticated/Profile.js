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
	List,
	ListItem,
	CardActions,
	Tab,
	Tabs,
	ListItemButton,
	ListItemText,
	ListItemAvatar,
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

function FollowersModal(props) {
	const { followingModalOpen, setFollowingModalOpen } = props;

	const [followers, setFollowers] = useState([]);

	const handleClose = () => {
		setFollowingModalOpen(false);
	};

	useEffect(() => {
		fetch('/api/user/followers')
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ followers }) => {
				setFollowers(followers);
			});
	}, []);
	return (
		<Modal id='followersModal' onClose={handleClose} open={followingModalOpen}>
			<Card>
				<CardHeader title='Followers' />
				<List>
					{followers?.map((follower, index) => {
						return (
							<ListItem key={index}>
								<ListItemAvatar>
									<Avatar src={follower.profilePhoto} />
								</ListItemAvatar>
								<ListItemText primary={follower.username} />
								<ListItemButton>
									<Button variant='outlined'>Remove</Button>
								</ListItemButton>
							</ListItem>
						);
					})}
				</List>
			</Card>
		</Modal>
	);
}

export default function Profile() {
	const { userData } = useOutletContext();
	const [ownerData, setOwnerData] = userData;

	const [posts, setPosts] = useState([]);

	const [followersModalOpen, setFollowersModalOpen] = useState(false);
	const [followingModalOpen, setFollowingModalOpen] = useState(false);

	const [modalOpen, setModalOpen] = useState(false);
	const [tabValue, setTabValue] = useState(0);

	const controller = new AbortController();
	const signal = controller.signal;

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

	useEffect(() => {
		fetch('/api/user/post', {
			signal,
		})
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then((result) => {
				setPosts(result.posts);
			});
	}, []);

	return (
		<main id='profile'>
			<FollowersModal
				ownerData={ownerData}
				followersModalOpen={followersModalOpen}
				setFollowersModalOpen={setFollowersModalOpen}
				followingModalOpen={followingModalOpen}
				setFollowingModalOpen={setFollowingModalOpen}
			/>
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
								<span>{posts.length ? posts.length : 0} posts</span>
								<Button
									onClick={() => setFollowingModalOpen(true)}
									disableRipple
									variant='standard'
								>
									{ownerData.following?.length} following
								</Button>
								<Button disableRipple variant='standard'>
									{ownerData.followers?.length} followers
								</Button>
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
					{posts?.map((post, index) => {
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
