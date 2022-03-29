import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
	Autocomplete,
	Avatar,
	AvatarGroup,
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
	Tab,
	Tabs,
	TextField,
} from '@mui/material';

import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Checkbox from '@mui/material/Checkbox';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import './design/inbox.css';

function TabPanel({ value, index, convo }) {
	console.log(convo);
	return (
		<div hidden={value !== index}>
			<TextField />
		</div>
	);
}

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

	const [tabValue, setTabValue] = useState(0);
	const [conversations, setConversations] = useState([]);

	const [anchorEl, setAnchorEl] = useState(null);
	let open = Boolean(anchorEl);

	const handleOpenModal = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseModal = () => {
		setAnchorEl(null);
	};

	const handleTabChange = (e, newValue) => {
		setTabValue(newValue);
	};

	const createConversation = async () => {
		setConversations(value);
		setAnchorEl(null);
	};
	useEffect(() => {
		console.log(conversations);
	}, [conversations]);

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

	useEffect(() => {
		fetch('/api/conversations')
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ data }) => {
				console.log(data);
				setConversations(data);
			});
	}, []);

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
					<Tabs
						orientation='vertical'
						value={tabValue}
						onChange={handleTabChange}
					>
						{conversations.map((conversation, index) => {
							return (
								<Tab
									label={
										<ListItemButton>
											<ListItemText primary={conversation.username} />
										</ListItemButton>
									}
									key={index}
								/>
							);
						})}
					</Tabs>
				</section>

				<section id='right'>
					{!conversations.length ? (
						<>
							<div id='noConversation'>
								<SendRoundedIcon />
							</div>

							<h3>Your Messages</h3>
							<p>Send private photos and messages to a friend or group.</p>
							<Button variant='contained' onClick={handleOpenModal}>
								Send Message
							</Button>
						</>
					) : (
						conversations.map((conversation, index) => {
							return (
								<TabPanel
									key={index}
									value={tabValue}
									index={index}
									convo={conversation}
								/>
							);
						})
					)}
				</section>
			</Card>

			{/* 		SEARCH MODAL		 */}
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
