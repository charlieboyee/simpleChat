import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInContext } from '../index';
import CreatePostModal from '../components/CreatePostModal';
import { Avatar, Button, IconButton, Menu, MenuItem } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import './authorized.css';

export default function NavBar(props) {
	const { userData, setUserData } = props;

	const navigate = useNavigate();

	const [loggedIn, setLoggedIn] = useContext(LoggedInContext);

	const [modalOpen, setModalOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
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
	return (
		<nav id='mainNav'>
			<CreatePostModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
			<Button
				onClick={() => navigate('/')}
				disableRipple
				id='left'
				variant='text'
			>
				simpleChat
			</Button>
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
				<IconButton disableRipple onClick={handleMenuClick}>
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
			</Menu>
		</nav>
	);
}
