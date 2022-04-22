import { useEffect, useState, useContext, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SocketContext } from '../../index';
import emojis from 'emojis-list';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
	Autocomplete,
	Avatar,
	AvatarGroup,
	Button,
	Card,
	CardHeader,
	IconButton,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Menu,
	Modal,
	Paper,
	Tab,
	Tabs,
	TextField,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

import './design/inbox.css';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

function TabPanel({ children, index, value, convo, conversationList }) {
	const { userData, allMessages, setAllMessages } = useOutletContext();
	const [loggedInUser] = userData;
	const [socket] = useContext(SocketContext);

	const bottomRef = useRef();
	const formRef = useRef();

	const [message, setMessage] = useState('');

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [emojiList, setEmojiList] = useState([]);
	const [hasMore, setHasMore] = useState(true);

	const [image, setImage] = useState();

	const controller = new AbortController();
	const signal = controller.signal;

	useEffect(() => {
		if (value === index && socket) {
			socket.on('receiveSentMessage', (data) => {
				setAllMessages((prevState) => {
					return [...prevState, data];
				});
			});

			const fetchConvo = async () => {
				const result = await fetch(
					`/api/conversations/conversation?id=${convo._id}`,
					{
						signal,
					}
				);

				if (result.status === 200) {
					const { conversation } = await result.json();
					setAllMessages(conversation.messages);
					socket.emit('joinRoom', {
						user: loggedInUser.username,
						room: conversation._id,
					});
				}
			};

			fetchConvo();
		}
		return () => {
			controller.abort();
			socket.off('receiveSentMessage');
			socket.emit('leaveRoom', {
				user: loggedInUser.username,
				room: convo._id,
			});
		};
	}, [value]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({
			behavior: 'smooth',
		});
	}, [allMessages]);

	useEffect(() => {
		if (image) {
			formRef.current.requestSubmit();
			setImage();
		}
	}, [image]);

	const openMenu = (event) => {
		setEmojiList(Array.from({ length: 300 }));
		setAnchorEl(event.currentTarget);
	};
	const closeMenu = () => {
		setAnchorEl(null);
	};

	const fetchNext = () => {
		if (emojiList.length >= emojis.length) {
			setHasMore(false);
			return;
		}

		setEmojiList((prevState) => {
			const newArr = prevState.concat(Array.from({ length: 500 }));
			if (newArr.length > emojis.length) {
				return emojis;
			}
			return newArr;
		});
	};

	const sendPhoto = async (e) => {
		e.preventDefault();

		const participants = convo.participants.map((user) => user.username);

		const messageObj = {
			message,
			timeStamp: new Date(),
			sender: loggedInUser.username,
			to: convo._id,
			media: true,
		};
		const formData = new FormData();

		formData.append('file', image);
		formData.append('messageObj', JSON.stringify(messageObj));
		formData.append('participants', participants);

		const result = await fetch(`/api/conversations/conversation`, {
			method: 'PUT',
			body: formData,
		});

		if (result.status === 200) {
			socket.emit('notifyUser', participants);

			const { data } = await result.json();
			messageObj.message = data.message;
			socket.emit('sendMessage', messageObj);
			setAllMessages((prevState) => {
				return [...prevState, messageObj];
			});
			setImage();
		}
	};

	const sendMessage = async (e) => {
		e.preventDefault();
		const participants = convo.participants.map((user) => user.username);

		const messageObj = {
			message,
			timeStamp: new Date(),
			sender: loggedInUser.username,
			to: convo._id,
			media: false,
		};

		const result = await fetch(`/api/conversations/conversation`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				messageObj,
				participants,
			}),
		});

		if (result.status === 200) {
			socket.emit('notifyUser', participants);

			socket.emit('sendMessage', messageObj);

			setAllMessages([...allMessages, messageObj]);
			setMessage('');
		}
	};

	return (
		<div className={value !== index ? 'tabPanel hidden' : 'tabPanel'}>
			{children}
			<main>
				{allMessages.map((messageObj, messageIndex) => {
					return (
						<Paper
							id={
								messageObj.sender === loggedInUser.username
									? 'outgoingMessage'
									: 'incomingMessage'
							}
							key={messageIndex}
							ref={messageIndex + 1 === allMessages.length ? bottomRef : null}
						>
							<div>{messageObj.sender}</div>
							{!messageObj.media ? (
								<div>{messageObj.message}</div>
							) : (
								<img
									className='messageImage'
									alt='img'
									src={`${process.env.REACT_APP_S3_URL}${messageObj.message}`}
								/>
							)}
							<div>{new Date(messageObj.timeStamp).toLocaleString()}</div>
						</Paper>
					);
				})}
			</main>

			<form ref={formRef} onSubmit={image ? sendPhoto : sendMessage}>
				<TextField
					fullWidth
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					InputProps={{
						endAdornment: message ? (
							<Button>Send</Button>
						) : (
							<IconButton component='label'>
								<input
									type='file'
									accept='img/*'
									hidden
									onChange={(e) => setImage(e.target.files[0])}
								/>
								<ImageOutlinedIcon />
							</IconButton>
						),
						startAdornment: (
							<IconButton onClick={openMenu}>
								<SentimentSatisfiedOutlinedIcon />
							</IconButton>
						),
					}}
				/>
			</form>
			<Menu
				sx={{ width: 900 }}
				anchorEl={anchorEl}
				open={open}
				onClose={closeMenu}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<div id='scrollableTarget'>
					<InfiniteScroll
						dataLength={emojiList.length}
						hasMore={hasMore}
						next={fetchNext}
						loader={<h4>Loading...</h4>}
						endMessage={<p style={{ textAlign: 'center' }}>No more emojis.</p>}
						scrollableTarget='scrollableTarget'
					>
						{emojiList.map((emoji, emojiIndex) => {
							return (
								<IconButton
									disableRipple
									onClick={(e) => {
										const newMessage = message.concat(e.target.innerText);
										setMessage(newMessage);
										closeMenu();
									}}
									key={emojiIndex}
								>
									{emojis[emojiIndex]}
								</IconButton>
							);
						})}
					</InfiniteScroll>
				</div>
			</Menu>
		</div>
	);
}

export default function Inbox() {
	const { userData } = useOutletContext();
	const [loggedInUser] = userData;

	const [anchorEl, setAnchorEl] = useState(null);
	let modalOpen = Boolean(anchorEl);

	const [conversationList, setConversationList] = useState([]);

	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState([]);
	const [value, setValue] = useState([]);
	const [tabValue, setTabValue] = useState(0);
	const loading = open && options.length === 0;

	const controller = new AbortController();
	const signal = controller.signal;

	useEffect(() => {
		fetch('/api/conversations', {
			signal,
		})
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ data }) => {
				setConversationList(data);
			});

		return () => {
			controller.abort();
		};
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

	const checkArrayEquality = (arr1, arr2) => {
		const uniqueValues = new Set([]);
		for (let i = 0; i < arr1.length; i++) {
			uniqueValues.add(arr2[i].username);
			uniqueValues.add(arr1[i].username);
		}

		if (uniqueValues.size !== arr2.length) {
			return false;
		}
		for (let i = 0; i < arr2.length; i++) {
			if (!uniqueValues.has(arr2[i].username)) {
				return false;
			}
		}
		return true;
	};

	const createConversationTab = () => {
		const convo = {
			participants: [
				{
					username: loggedInUser.username,
					profilePhoto: loggedInUser.profilePhoto,
				},
				...value,
			],
		};
		//need to check if conversations with the same users already exists here.
		for (let i = 0; i < conversationList.length; i++) {
			const isEqual = checkArrayEquality(
				conversationList[i].participants,
				convo.participants
			);
			if (!isEqual) {
				continue;
			}
			if (isEqual) {
				setTabValue(i);
				closeModal();
				return;
			}
		}

		setConversationList([...conversationList, convo]);
		closeModal();
	};

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
						titleTypographyProps={{ variant: 'h5' }}
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
								conversationList={conversationList}
							>
								<CardHeader
									titleTypographyProps={{ variant: 'h5' }}
									avatar={
										<AvatarGroup max={4}>
											{selectedConvo.participants.map((user, userIndex) => {
												return (
													<Avatar
														key={userIndex}
														src={`${process.env.REACT_APP_S3_URL}${user.profilePhoto}`}
													/>
												);
											})}
										</AvatarGroup>
									}
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
