import { useEffect, useState, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SocketContext } from '../../index';
import {
	Autocomplete,
	Avatar,
	AvatarGroup,
	Badge,
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

function TabPanel({ value, index, convo, children }) {
	const [message, setMessage] = useState('');

	let socket = useContext(SocketContext);

	const sendMessage = () => {
		socket.emit('message', message);
	};
	return (
		<div id='tabPanel' className={value !== index ? 'hidden' : null}>
			{children}
			<TextField
				placeholder='Message'
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				fullWidth
				InputProps={{
					endAdornment: (
						<Button variant='text' onClick={sendMessage}>
							Send
						</Button>
					),
				}}
			/>
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
		setValue([]);
		setAnchorEl(null);
	};

	const handleTabChange = (e, newValue) => {
		setTabValue(newValue);
	};

	const createConversation = () => {
		//take all convos and see if it matches value object
		//value is a conversation, it can contain 1 or more users
		setConversations([value, ...conversations]);
		handleCloseModal();
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

	// useEffect(() => {
	// 	fetch('/api/conversations')
	// 		.then((res) => {
	// 			if (res.status === 200) {
	// 				return res.json();
	// 			}
	// 		})
	// 		.then(({ data }) => {
	// 			setConversations(data);
	// 		});
	// }, []);

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
					{!conversations.length ? (
						<div>nothing to display</div>
					) : (
						<Tabs
							orientation='vertical'
							value={tabValue}
							onChange={handleTabChange}
						>
							{conversations.map((convo, index) => {
								// convo is the individual conversation tab
								if (convo.length === 1) {
									return (
										<Tab
											key={index}
											label={
												<ListItem>
													<ListItemAvatar>
														<Avatar
															src={
																convo[0].profilePhoto &&
																`${process.env.REACT_APP_S3_URL}${convo[0].profilePhoto}`
															}
														/>
													</ListItemAvatar>
													<ListItemText primary={convo[0].username} />
												</ListItem>
											}
										/>
									);
								}

								return (
									<Tab
										key={index}
										label={
											<ListItem>
												<ListItemAvatar>
													<AvatarGroup max={3}>
														{convo.map((user, userIndex) => {
															return (
																<Avatar
																	key={userIndex}
																	src={
																		user.profilePhoto &&
																		`${process.env.REACT_APP_S3_URL}${user.profilePhoto}`
																	}
																/>
															);
														})}
													</AvatarGroup>
												</ListItemAvatar>
												<ListItemText
													id='convoUsers'
													primary={convo
														.map((user, userIndex) => {
															return user.username;
														})
														.toString()}
												/>
											</ListItem>
										}
									/>
								);
							})}
						</Tabs>
					)}
				</section>

				<section id={conversations.length ? `right` : `right noConversation`}>
					{!conversations.length ? (
						<>
							<div>
								<SendRoundedIcon />
							</div>

							<h3>Your Messages</h3>
							<p>Send private photos and messages to a friend or group.</p>
							<Button variant='contained' onClick={handleOpenModal}>
								Send Message
							</Button>
						</>
					) : (
						conversations.map((convo, index) => {
							return (
								<TabPanel key={index} value={tabValue} index={index}>
									<header>
										<AvatarGroup>
											{convo.map((user, userIndex) => {
												return (
													<Avatar
														key={userIndex}
														src={
															user.profilePhoto &&
															`${process.env.REACT_APP_S3_URL}${user.profilePhoto}`
														}
													/>
												);
											})}
										</AvatarGroup>

										{convo
											.map((user, userIndex) => {
												return user.username;
											})
											.toString()}
									</header>
									<main></main>
								</TabPanel>
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
						isOptionEqualToValue={(option, value) =>
							option.username === value.username
						}
						value={value}
						onChange={(event, newValue) => {
							console.log(newValue);
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
						{value?.map((selectedUser, index) => {
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
