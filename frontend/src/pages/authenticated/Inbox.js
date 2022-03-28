import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
	Autocomplete,
	Avatar,
	Button,
	Card,
	CardHeader,
	CardContent,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Modal,
	TextField,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Checkbox from '@mui/material/Checkbox';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import './design/inbox.css';

function CBox({ value, setValue, searchedIndex }) {
	const [checked, setChecked] = useState(true);
	const toggleCheck = (e) => {
		if (!e.target.checked) {
			setValue((prevState) => {
				return prevState.filter((searchedUser, index) => {
					console.log(prevState.indexOf(searchedUser));
					return prevState.indexOf(searchedUser) !== searchedIndex;
				});
			});
		}
	};
	return <Checkbox checked={checked} onChange={toggleCheck} />;
}

export default function Inbox() {
	const { userData } = useOutletContext();

	const [loggedInUser] = userData;

	const [options, setOptions] = useState([]);
	const [value, setValue] = useState([]);

	const [anchorEl, setAnchorEl] = useState(null);
	let open = Boolean(anchorEl);

	const handleOpenModal = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseModal = () => {
		setAnchorEl(null);
	};

	const createConversation = async () => {
		const results = await fetch('/api/conversatation', {
			method: 'PUT',
			body: JSON.stringify({ selectedUsers: value }),
		});

		if (results.status === 200) {
			const { data } = await results.json();
			console.log(data);
			return;
		}
		return;
	};

	useEffect(() => {
		console.log(value);
	}, [value]);

	useEffect(() => {
		if (open) {
			fetch('/api/allUsers')
				.then((res) => {
					if (res.status === 200) {
						return res.json();
					}
				})
				.then((result) => setOptions(result.options));
		}
	}, [open]);

	return (
		<>
			<Card id='inboxCard'>
				<section id='left'>
					<header>
						<span>{loggedInUser.username}</span>
						<IconButton disableRipple onClick={handleOpenModal}>
							<OpenInNewRoundedIcon />
						</IconButton>
					</header>
				</section>
				<section id='right'>
					<div>
						<SendRoundedIcon />
					</div>

					<h3>Your Messages</h3>
					<p>Send private photos and messages to a friend or group.</p>
					<Button variant='contained' onClick={handleOpenModal}>
						Send Message
					</Button>
				</section>
			</Card>
			<Modal id='inboxModal' onClose={handleCloseModal} open={open}>
				<Card>
					<CardHeader
						avatar={
							<IconButton>
								<CloseRoundedIcon />
							</IconButton>
						}
						title={loggedInUser.username}
						action={<Button onClick={createConversation}>Next</Button>}
					/>
					<Autocomplete
						multiple
						freeSolo
						isOptionEqualToValue={(option, value) =>
							option.username === value.username
						}
						value={value}
						onChange={(event, newValue) => {
							setValue(newValue);
						}}
						getOptionLabel={(option) => option.username}
						options={options}
						renderInput={(params) => (
							<TextField
								{...params}
								variant='standard'
								placeholder='Search...'
							/>
						)}
						renderOption={(props, option) => {
							return (
								<ListItemButton {...props}>
									<ListItemAvatar>
										<Avatar
											src={
												option.profilePhoto &&
												`${process.env.REACT_APP_S3_URL}${option.profilePhoto}`
											}
										/>
									</ListItemAvatar>

									<ListItemText primary={option.username} />
								</ListItemButton>
							);
						}}
					/>
					<List>
						{/* Value is the array of selected users */}
						{value.map((selectedUser, index) => {
							return (
								<ListItem
									key={index}
									secondaryAction={
										<CBox
											value={value}
											setValue={setValue}
											searchedIndex={index}
										/>
									}
								>
									<ListItemButton>
										<ListItemAvatar>
											<Avatar
												src={
													selectedUser.profilePhoto &&
													`${process.env.REACT_APP_S3_URL}${selectedUser.profilePhoto}`
												}
											/>
										</ListItemAvatar>

										<ListItemText primary={selectedUser.username} />
									</ListItemButton>
								</ListItem>
							);
						})}
					</List>
				</Card>
			</Modal>
		</>
	);
}
