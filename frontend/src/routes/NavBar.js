import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInContext } from '../index';
import CreatePostModal from '../components/CreatePostModal';
import {
	Autocomplete,
	Avatar,
	Button,
	Input,
	IconButton,
	Menu,
	MenuItem,
	TextField,
	CircularProgress,
} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import './authorized.css';

export default function NavBar(props) {
	const { userData, setUserData } = props;

	const navigate = useNavigate();

	const [loggedIn, setLoggedIn] = useContext(LoggedInContext);

	const [searchInput, setSearchInput] = useState('');
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchOptions, setSearchOptions] = useState([]);
	const searchLoading = searchOpen && searchOptions.length === 0;

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
				sx={{ width: 400 }}
				open={searchOpen}
				inputValue={searchInput}
				onInputChange={(e, newInputValue) => {
					setSearchInput(newInputValue);
				}}
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
								return navigate(`/profile/${searchInput}`);
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
