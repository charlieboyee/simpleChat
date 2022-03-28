import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
	Autocomplete,
	Button,
	Card,
	CardHeader,
	IconButton,
	Modal,
	TextField,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import './design/inbox.css';

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
						action={<Button>Next</Button>}
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
						renderInput={(params) => <TextField {...params} />}
					/>
				</Card>
			</Modal>
		</>
	);
}
