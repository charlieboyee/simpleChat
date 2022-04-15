import { useEffect, useState, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SocketContext } from '../../index';
import {
	Autocomplete,
	Avatar,
	AvatarGroup,
	Button,
	Card,
	CardHeader,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Modal,
	Paper,
	Tab,
	Tabs,
	TextField,
} from '@mui/material';

import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Checkbox from '@mui/material/Checkbox';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import './design/inbox.css';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

function TabPanel({ children, index, value, convo }) {
	const { userData } = useOutletContext();
	const [loggedInUser] = userData;
	const [socket] = useContext(SocketContext);

	const [message, setMessage] = useState('');
	const [allMessages, setAllMessages] = useState([]);

	useEffect(() => {
		if (value === index && socket) {
			const fetchConvo = async () => {
				const result = await fetch(
					`/api/conversations/conversation?id=${convo._id}`
				);

				if (result.status === 200) {
					const { conversation } = await result.json();
					setAllMessages(conversation.messages);
					socket.emit('joinRoom', conversation._id);
				}
			};

			fetchConvo();
		}
	}, [value]);

	const sendMessage = (e) => {
		e.preventDefault();

		const payload = {
			message,
			timeStamp: new Date(),
			sender: loggedInUser.username,
			to: convo._id,
		};
		socket.emit('sendMessage', payload);
	};

	return (
		<div className={value !== index ? 'tabPanel hidden' : 'tabPanel'}>
			{children}
			<main>
				{allMessages.map((messageObj, messageIndex) => {
					return <div key={messageIndex}>{messageObj.message}</div>;
				})}
			</main>

			<form onSubmit={sendMessage}>
				<TextField
					fullWidth
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					InputProps={{ endAdornment: <Button>Send</Button> }}
				/>
			</form>
		</div>
	);
}

export default function Inbox() {
	const [socket] = useContext(SocketContext);

	const { conversationList, setConversationList } = useOutletContext();

	const [anchorEl, setAnchorEl] = useState(null);
	let modalOpen = Boolean(anchorEl);

	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState([]);
	const [value, setValue] = useState([]);
	const [tabValue, setTabValue] = useState(0);
	const loading = open && options.length === 0;

	const closeModal = () => {
		setAnchorEl(null);
		setValue([]);
	};

	const openModal = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleTabChange = (e, newValue) => {
		setTabValue(newValue);
	};
	const createConversationTab = () => {
		const convo = { participants: value };
		setConversationList([...conversationList, convo]);
		closeModal();
	};

	useEffect(() => {
		fetch('/api/conversations')
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ data }) => {
				setConversationList(data);
			});
	}, []);

	useEffect(() => {
		if (open) {
			fetch('/api/allUsers')
				.then((res) => {
					if (res.status === 200) {
						return res.json();
					}
				})
				.then(({ options }) => {
					setOptions(options);
				});
		}
	}, [open]);
	if (!conversationList.length) {
		return (
			<>
				<Modal id='inboxModal' onClose={closeModal} open={modalOpen}>
					<Card>
						<CardHeader
							avatar={
								<IconButton onClick={closeModal}>
									<CloseRoundedIcon />
								</IconButton>
							}
							title='New Message'
							action={<Button onClick={createConversationTab}>Next</Button>}
						/>
						<Autocomplete
							multiple
							open={open}
							onOpen={() => {
								setOpen(true);
							}}
							onClose={() => {
								setOpen(false);
							}}
							value={value}
							onChange={(event, value) => {
								setValue(value);
							}}
							options={options}
							loading={loading}
							getOptionLabel={(option) => option.username}
							isOptionEqualToValue={(option, value) =>
								option.username === value.username
							}
							renderInput={(params) => (
								<TextField
									placeholder='Search'
									variant='standard'
									{...params}
								/>
							)}
							renderOption={(props, option, { selected }) => (
								<ListItem {...props}>
									<ListItemAvatar>
										<Avatar
											src={
												option.profilePhoto &&
												process.env.REACT_APP_S3_URL + option.profilePhoto
											}
										/>
									</ListItemAvatar>
									<ListItemText primary={option.username} />

									<Checkbox
										icon={icon}
										checkedIcon={checkedIcon}
										style={{ marginRight: 8 }}
										checked={selected}
									/>
									{option.title}
								</ListItem>
							)}
						/>
					</Card>
				</Modal>

				<Card className='inboxCard noMessage'>
					<div>
						<SendRoundedIcon />
					</div>

					<div>
						<h3>Your Messages</h3>
						<p>Send private photos and messages to a friend or group.</p>
					</div>
					<Button onClick={openModal} variant='contained'>
						Send Message
					</Button>
				</Card>
			</>
		);
	}
	return (
		<>
			<Modal id='inboxModal' onClose={closeModal} open={modalOpen}>
				<Card>
					<CardHeader
						avatar={
							<IconButton onClick={closeModal}>
								<CloseRoundedIcon />
							</IconButton>
						}
						title='New Message'
						action={<Button onClick={createConversationTab}>Next</Button>}
					/>
					<Autocomplete
						multiple
						open={open}
						onOpen={() => {
							setOpen(true);
						}}
						onClose={() => {
							setOpen(false);
						}}
						value={value}
						onChange={(event, value) => {
							setValue(value);
						}}
						options={options}
						loading={loading}
						getOptionLabel={(option) => option.username}
						isOptionEqualToValue={(option, value) =>
							option.username === value.username
						}
						renderInput={(params) => (
							<TextField placeholder='Search' variant='standard' {...params} />
						)}
						renderOption={(props, option, { selected }) => (
							<ListItem {...props}>
								<ListItemAvatar>
									<Avatar
										src={
											option.profilePhoto &&
											process.env.REACT_APP_S3_URL + option.profilePhoto
										}
									/>
								</ListItemAvatar>
								<ListItemText primary={option.username} />

								<Checkbox
									icon={icon}
									checkedIcon={checkedIcon}
									style={{ marginRight: 8 }}
									checked={selected}
								/>
								{option.title}
							</ListItem>
						)}
					/>
				</Card>
			</Modal>

			<Card className='inboxCard yesMessage'>
				<section id='left'>
					<CardHeader
						title='Conversations'
						action={
							<IconButton onClick={openModal}>
								<OpenInNewRoundedIcon />
							</IconButton>
						}
					/>
					<Tabs
						orientation='vertical'
						value={tabValue}
						onChange={handleTabChange}
					>
						{conversationList.map((selectedConvo, selectedConvoIndex) => {
							if (selectedConvo.participants?.length === 1) {
								return (
									<Tab
										key={selectedConvoIndex}
										icon={
											<Avatar
												src={
													selectedConvo.participants[0].profilePhoto &&
													process.env.REACT_APP_S3_URL +
														selectedConvo.participants[0].profilePhoto
												}
											/>
										}
										iconPosition='start'
										label={selectedConvo.participants[0].username}
									/>
								);
							}
							return (
								<Tab
									key={selectedConvoIndex}
									icon={
										<AvatarGroup max={4}>
											{selectedConvo.participants?.map((user, userIndex) => {
												return (
													<Avatar
														key={userIndex}
														src={
															user.profilePhoto &&
															process.env.REACT_APP_S3_URL + user.profilePhoto
														}
													/>
												);
											})}
										</AvatarGroup>
									}
									iconPosition='start'
									label={selectedConvo.participants
										?.map((user, userIndex) => {
											return user.username;
										})
										.join(', ')}
								/>
							);
						})}
					</Tabs>
				</section>
				<section id='right'>
					{conversationList.map((selectedConvo, selectedConvoIndex) => {
						return (
							<TabPanel
								key={selectedConvoIndex}
								value={tabValue}
								index={selectedConvoIndex}
								convo={selectedConvo}
							>
								<CardHeader
									title={selectedConvo.participants
										?.map((user, userIndex) => {
											return user.username;
										})
										.join(', ')}
								/>
							</TabPanel>
						);
					})}
				</section>
			</Card>
		</>
	);
}
