import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInContext } from '../index';
import CreatePostModal from '../components/CreatePostModal';
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

export default function NavBar(props) {
	const { userData, socket } = props;
	const navigate = useNavigate();

	const [loggedIn, setLoggedIn] = useContext(LoggedInContext);

	const [notifications, setNotifications] = useState([]);
	const [notificationCount, setNotificationCount] = useState(0);

	const [searchOpen, setSearchOpen] = useState(false);
	const [searchOptions, setSearchOptions] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const searchLoading = searchOpen && searchOptions.length === 0;

	const [modalOpen, setModalOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
		setTimeout(() => {
			setNotificationCount(0);
		}, 2000);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const openCreatePostModal = () => setModalOpen(true);

	const logOut = async () => {
		const result = await fetch('/api/logOut', {
			method: 'POST',
		});
		if (result.status === 200) {
			setLoggedIn(false);
			navigate('/', { replace: true });
			console.log('sucessfully logged out');
			return;
		}
		return;
	};

	useEffect(() => {
		fetch('/api/notifications/count')
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ count }) => setNotificationCount(count));
	}, []);

	useEffect(() => {
		if (!searchLoading) {
			return;
		}
		fetch('/api/allUsers')
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
		if (anchorEl?.id === 'notificationButton') {
			fetch('/api/notifications')
				.then((res) => {
					if (res.status === 200) {
						return res.json();
					}
				})
				.then((result) => setNotifications(result.notifications));
		}
	}, [anchorEl]);

	const setNotificationText = (type) => {
		switch (type) {
			case 'like':
				return 'liked your post.';
			default:
				return;
		}
	};

	return (
		<nav id='mainNav'>
			<CreatePostModal
				userData={userData}
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
			/>
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
				<IconButton disableRipple>
					<SendRoundedIcon className='mainNavButtons' />
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
								handleMenuClose();
							}}
						>
							Log Out
						</MenuItem>
					</div>
				) : anchorEl?.id === 'notificationButton' ? (
					notifications?.map((notification, index) => {
						if (!notification.read) {
							return (
								<MenuItem key={index}>
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
				) : null}
			</Menu>
		</nav>
	);
}
