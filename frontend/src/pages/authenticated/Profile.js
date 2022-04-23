import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
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

function FollowingModal({
	followingModalOpen,
	setFollowingModalOpen,
	loggedInUser,
	setLoggedInUser,
}) {
	const [following, setFollowing] = useState([]);

	useEffect(() => {
		fetch('/api/user/following')
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ data }) => {
				setFollowing(data[0].following);
			});
	}, []);

	const handleClose = () => {
		setFollowingModalOpen(false);
	};

	const unFollow = async (userToUnfollow) => {
		const result = await fetch(`/api/otherUser/${userToUnfollow}/unfollow`, {
			method: 'PUT',
		});

		if (result.status === 200) {
			const { data } = await result.json();

			const newArr = following.filter((user, userIndex) => {
				return data.following.includes(user.username);
			});
			setFollowing(newArr);
			setLoggedInUser({ ...loggedInUser, following: newArr });
			handleClose();
			return;
		}
	};
	return (
		<Modal className='ffModal' onClose={handleClose} open={followingModalOpen}>
			<Card>
				<CardHeader title='Following' />
				<List>
					{following?.map((user, index) => {
						return (
							<ListItem key={index}>
								<ListItemAvatar>
									<Avatar
										src={
											user.profilePhoto &&
											`${process.env.REACT_APP_S3_URL}${user.profilePhoto}`
										}
									/>
								</ListItemAvatar>
								<ListItemText primary={user.username} />

								<Button
									onClick={() => unFollow(user.username)}
									variant='outlined'
								>
									Unfollow
								</Button>
							</ListItem>
						);
					})}
				</List>
			</Card>
		</Modal>
	);
}

function FollowersModal({
	followersModalOpen,
	setFollowersModalOpen,
	loggedInUser,
	setLoggedInUser,
}) {
	const [followers, setFollowers] = useState([]);

	useEffect(() => {
		fetch('/api/user/followers')
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ data }) => {
				setFollowers(data[0].followers);
			});
	}, []);

	const handleClose = () => {
		setFollowersModalOpen(false);
	};

	const removeFollower = async (userToRemove) => {
		const result = await fetch(`/api/user/removeFollower/${userToRemove}`, {
			method: 'PUT',
		});

		if (result.status === 200) {
			const { data } = await result.json();
			const newArr = followers.filter((user, userIndex) => {
				return data.followers.includes(user.username);
			});

			setFollowers(newArr);
			setLoggedInUser({ ...loggedInUser, followers: data.followers });
			handleClose();
		}
	};
	return (
		<Modal className='ffModal' onClose={handleClose} open={followersModalOpen}>
			<Card>
				<CardHeader title='Followers' />
				<List>
					{followers?.map((follower, index) => {
						return (
							<ListItem key={index}>
								<ListItemAvatar>
									<Avatar
										src={
											follower.profilePhoto &&
											`${process.env.REACT_APP_S3_URL}${follower.profilePhoto}`
										}
									/>
								</ListItemAvatar>
								<ListItemText primary={follower.username} />

								<Button
									onClick={() => removeFollower(follower.username)}
									variant='outlined'
								>
									Remove
								</Button>
							</ListItem>
						);
					})}
				</List>
			</Card>
		</Modal>
	);
}

function ChangePhotoModal(props) {
	const { modalOpen, setModalOpen, ownerData, setOwnerData } = props;

	const handleModalClose = () => {
		setModalOpen(false);
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

	return (
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
	);
}

export default function Profile() {
	const { userData } = useOutletContext();
	const [ownerData, setOwnerData] = userData;

	const navigate = useNavigate();

	const [posts, setPosts] = useState([]);

	const [followersModalOpen, setFollowersModalOpen] = useState(false);
	const [followingModalOpen, setFollowingModalOpen] = useState(false);

	const [modalOpen, setModalOpen] = useState(false);
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (e, newValue) => setTabValue(newValue);

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

	useEffect(() => {
		fetch('/api/user/post')
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
				followersModalOpen={followersModalOpen}
				setFollowersModalOpen={setFollowersModalOpen}
				loggedInUser={ownerData}
				setLoggedInUser={setOwnerData}
			/>
			<FollowingModal
				followingModalOpen={followingModalOpen}
				setFollowingModalOpen={setFollowingModalOpen}
				loggedInUser={ownerData}
				setLoggedInUser={setOwnerData}
			/>
			<ChangePhotoModal
				ownerData={ownerData}
				setOwnerData={setOwnerData}
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
			/>
			<section id='upperSection'>
				<Card raised>
					<CardMedia>
						{ownerData.profilePhoto ? (
							<IconButton
								onClick={() => setModalOpen(true)}
								disableRipple
								component='label'
							>
								<Avatar
									id='profilePhoto'
									src={`${process.env.REACT_APP_S3_URL}${ownerData.profilePhoto}`}
								/>
							</IconButton>
						) : (
							<IconButton disableRipple component='label'>
								<Input
									sx={{ display: 'none' }}
									accept='image/*'
									id='uploadProfilePhoto'
									type='file'
									onChange={(e) => uploadProfilePhoto(e)}
								/>

								<Avatar id='profilePhoto' />
							</IconButton>
						)}
					</CardMedia>
					<CardContent>
						<div>
							<div>
								<span>{ownerData.username}</span>
								<Button variant='contained' onClick={() => navigate('/edit')}>
									Edit Profile
								</Button>
							</div>
							<div>
								<span>{posts.length ? posts.length : 0} Posts</span>
								<Button
									onClick={() => setFollowersModalOpen(true)}
									disableRipple
									variant='string'
								>
									{`${
										ownerData.followers?.length
											? ownerData.followers?.length
											: 0
									} 
									Followers`}
								</Button>
								<Button
									onClick={() => setFollowingModalOpen(true)}
									disableRipple
									variant='string'
								>
									{`${
										ownerData.following?.length
											? ownerData.following?.length
											: 0
									}
									Following`}
								</Button>
							</div>
							<div>
								{ownerData.description ? ownerData.descriptio : 'nothing'}
							</div>
						</div>
					</CardContent>
				</Card>
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
