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

function TabPanel() {
	return <div></div>;
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

	const handleClose = () => {
		setAnchorEl(null);
	};

	const openModal = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleTabChange = (e, newValue) => {
		setTabValue(newValue);
	};
	const createConversationTab = () => {
		setConversationList(value);
	};

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

	// useEffect(() => {
	// 	fetch('/api/')
	// }, [])

	if (!conversationList.length) {
		return (
			<>
				<Modal id='inboxModal' onClose={handleClose} open={modalOpen}>
					<Card>
						<CardHeader
							avatar={
								<IconButton onClick={handleClose}>
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
		<Card className='inboxCard'>
			<section id='right'>
				<Tabs value={tabValue} onChange={handleTabChange}>
					{value.map((selectedUser, selectedUserIndex) => {
						return (
							<Tab key={selectedUserIndex} label={selectedUser.username} />
						);
					})}
				</Tabs>
			</section>
			<section id='left'>
				<TabPanel></TabPanel>
			</section>
		</Card>
	);
}
