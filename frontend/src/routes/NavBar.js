import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoggedInContext, SocketContext } from '../index';
import CreatePostModal from '../components/CreatePostModal';
import PostModal from '../components/PostModal';
import {
	Autocomplete,
	Avatar,
	Badge,
	CircularProgress,
	Button,
	IconButton,
	ListItemText,
	Menu,
	MenuItem,
	TextField,
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import './authorized.css';

export default function NavBar({
	userData,
	notificationCount,
	setNotificationCount,
}) {
	const navigate = useNavigate();
	const location = useLocation();

	const [loggedIn, setLoggedIn] = useContext(LoggedInContext);
	const [socket] = useContext(SocketContext);

	const [notifications, setNotifications] = useState([]);

	const [notificationId, setNotificationId] = useState(null);

	const [searchOpen, setSearchOpen] = useState(false);
	const [searchOptions, setSearchOptions] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const searchLoading = searchOpen && searchOptions.length === 0;

	const [modalOpen, setModalOpen] = useState(false);
	const [postModalOpen, setPostModalOpen] = useState(false);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [postToView, setPostToView] = useState(null);

	const [newMessageBadge, setNewMessageBadge] = useState(true);

	const controller = new AbortController();
	const signal = controller.signal;

	useEffect(() => {
		return () => {
			controller.abort();
		};
	}, []);

	useEffect(() => {
		console.log(notifications);
	}, [notifications]);

	useEffect(() => {
		if (!searchLoading) {
			return;
		}
		fetch('/api/allUsers', { signal })
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ options }) => setSearchOptions(options));
	}, [searchLoading]);

	useEffect(() => {
		if (!searchOpen) {
			return setSearchOptions([]);
		}
	}, [searchOpen]);

	useEffect(() => {
		if (anchorEl && anchorEl.id === 'notificationButton') {
			fetch('/api/notifications', { signal })
				.then((res) => {
					if (res.status === 200) {
						return res.json();
					}
				})
				.then((result) => {
					//array of ALL user notifications read and unread
					setNotifications(result.notifications);
				});
		}
	}, [anchorEl]);

	useEffect(() => {
		if (socket && location.pathname !== '/inbox') {
			socket.on('notifyUser', () => {
				setNewMessageBadge(false);
			});
		}
		return () => {
			socket.off('notifyUser');
		};
	}, [socket, location]);

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
		if (event.currentTarget.id === 'notificationButton') {
			setTimeout(() => {
				setNotificationCount(0);
			}, 2000);
		}
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const setNotificationText = (type) => {
		switch (type) {
			case 'like':
				return 'liked your post.';
			case 'comment':
				return 'commented on your post.';
			case 'following':
				return 'is following you.';
			default:
				return;
		}
	};

	const goToPost = (postId, notiId) => {
		setNotificationId(notiId);
		setPostModalOpen(true);
		setPostToView(postId);
		setAnchorEl(null);
	};

	const goToUser = (user, id) => {
		navigate(`/profile/${user}`);
		setAnchorEl(null);
		fetch(`/api/notifications/read/?id=${id}`, {
			method: 'PUT',
		});
	};

	const openCreatePostModal = () => setModalOpen(true);

	const logOut = async () => {
		const result = await fetch('/api/logOut', {
			method: 'POST',
		});
		if (result.status === 200) {
			handleMenuClose();
			setLoggedIn(false);
			navigate('/', { replace: true });
			return;
		}
		return;
	};

	return (
		<nav id='mainNav'>
			<Button
				onClick={() => navigate('/')}
				disableRipple
				id='left'
				variant='text'
			>
				simpleChat
			</Button>
			<Autocomplete
				inputValue={searchValue}
				onInputChange={(e, newInputValue) => setSearchValue(newInputValue)}
				open={searchOpen}
				isOptionEqualToValue={(option) => option.username}
				onOpen={() => setSearchOpen(true)}
				onClose={() => setSearchOpen(false)}
				loading={searchLoading}
				options={searchOptions}
				getOptionLabel={(option) => option.username}
				renderOption={(props, option) => {
					return (
						<span id='searchItem' {...props}>
							{option.username}
						</span>
					);
				}}
				renderInput={(params) => (
					<TextField
						variant='filled'
						{...params}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								return navigate(`/profile/${searchValue}`);
							}
						}}
						placeholder={searchLoading ? 'Loading...' : 'Search'}
						InputProps={{
							disableUnderline: true,
							...params.InputProps,
							endAdornment: searchLoading ? (
								<CircularProgress />
							) : (
								params.InputProps.endAdornment
							),
						}}
					/>
				)}
			/>
			<span id='right'>
				<IconButton disableRipple onClick={() => navigate('/')}>
					<HomeRoundedIcon className='mainNavButtons' />
				</IconButton>
				<IconButton
					disableRipple
					onClick={() => {
						navigate('/inbox');
						setNewMessageBadge(true);
					}}
				>
					<Badge color='primary' variant='dot' invisible={newMessageBadge}>
						<SendRoundedIcon className='mainNavButtons' />
					</Badge>
				</IconButton>
				<IconButton disableRipple onClick={openCreatePostModal}>
					<FileUploadRoundedIcon className='mainNavButtons' />
				</IconButton>
				<IconButton
					disableRipple
					id='notificationButton'
					onClick={handleMenuClick}
				>
					<Badge badgeContent={notificationCount} color='primary'>
						<NotificationsRoundedIcon className='mainNavButtons' />
					</Badge>
				</IconButton>
				<IconButton
					disableRipple
					id='profilePhotoButton'
					onClick={handleMenuClick}
				>
					<Avatar
						className='mainNavButtons'
						src={
							userData.profilePhoto
								? `${process.env.REACT_APP_S3_URL}${userData.profilePhoto}`
								: null
						}
					/>
				</IconButton>
			</span>
			<PostModal
				postModalOpen={postModalOpen}
				setPostModalOpen={setPostModalOpen}
				post={postToView}
				setPostToView={setPostToView}
				loggedInUser={userData}
				notiId={notificationId}
			/>
			<CreatePostModal
				userData={userData}
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
			/>
			<Menu anchorEl={anchorEl} onClose={handleMenuClose} open={open}>
				{anchorEl?.id === 'profilePhotoButton' ? (
					<div>
						<MenuItem
							onClick={() => {
								handleMenuClose();
								navigate('profile');
							}}
						>
							Profile
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleMenuClose();
								navigate('edit');
							}}
						>
							Edit Profile
						</MenuItem>
						<MenuItem
							onClick={() => {
								logOut();
							}}
						>
							Log Out
						</MenuItem>
					</div>
				) : anchorEl?.id === 'notificationButton' ? (
					notifications.filter((noti) => !noti.read).length ? (
						notifications?.map((notification, index) => {
							if (!notification.read) {
								return (
									<MenuItem
										key={index}
										onClick={() => {
											console.log('clicking');
											switch (notification.type) {
												case 'like' || 'comment':
													goToPost(notification.postRef, notification._id);
													return;
												case 'following':
													goToUser(
														notification.sender[0].username,
														notification._id
													);
													return;
												default:
													return;
											}
										}}
									>
										<Avatar
											src={
												notification.sender[0].profilePhoto &&
												`${process.env.REACT_APP_S3_URL}${notification.sender[0].profilePhoto}`
											}
										/>

										<ListItemText
											primary={notification.sender[0].username}
											secondary={setNotificationText(notification.type)}
										/>
									</MenuItem>
								);
							}
						})
					) : (
						<MenuItem>No new notifications</MenuItem>
					)
				) : null}
			</Menu>
		</nav>
	);
}
