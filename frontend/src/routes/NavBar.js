import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInContext } from '../index';
import { Avatar, Button, IconButton, Menu, MenuItem } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import './authorized.css';

export default function NavBar() {
	const navigate = useNavigate();
	const [loggedIn, setLoggedIn] = useContext(LoggedInContext);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const logOut = async () => {
		const result = await fetch('/api/logOut', {
			method: 'POST',
		});
		if (result.status === 200) {
			localStorage.clear();
			setLoggedIn(false);
			console.log('sucessfully logged out');
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
			<span id='right'>
				<IconButton onClick={() => navigate('/')}>
					<HomeRoundedIcon />
				</IconButton>
				<IconButton>
					<SendRoundedIcon />
				</IconButton>
				<IconButton onClick={handleMenuClick}>
					<Avatar src='' />
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
