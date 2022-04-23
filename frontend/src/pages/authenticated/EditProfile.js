import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
	Avatar,
	Card,
	Checkbox,
	Button,
	IconButton,
	Tab,
	Tabs,
	TextField,
} from '@mui/material';
import './design/editProfile.css';

function TabPanel({ children, value, index }) {
	return (
		<div
			value={value}
			className={value !== index ? 'tabPanel hidden' : 'tabPanel'}
		>
			{children}
		</div>
	);
}
export default function EditProfile() {
	const { userData } = useOutletContext();
	const [loggedInUser] = userData;

	const [value, setValue] = useState(0);
	const [img, setImg] = useState(null);

	const handleChange = (e, newValue) => {
		setValue(newValue);
	};
	return (
		<main>
			<Card id='editProfileCard'>
				<Tabs orientation='vertical' value={value} onChange={handleChange}>
					<Tab label='Edit Proflie' />
					<Tab label='Change Password' />
					<Tab label='Apps and Websites' />
					<Tab label='Email Notifications' />
					<Tab label='Push Notifications' />
					<Tab label='Manage Contacts' />
					<Tab label='Privacy and Security' />
					<Tab label='Supervision' />
					<Tab label='Login Activity' />
					<Tab label='Emails from Instagram' />
					<Tab label='Help' />
				</Tabs>
				<TabPanel value={value} index={0}>
					<section>
						<span>
							<IconButton
								disableRipple
								component='label'
								htmlFor='editChangePhoto'
							>
								<Avatar
									src={
										loggedInUser.profilePhoto &&
										`${process.env.REACT_APP_S3_URL}${loggedInUser.profilePhoto}`
									}
								/>
							</IconButton>
						</span>

						<input
							id='editChangePhoto'
							type='file'
							accept='image/*'
							onChange={(e) => setImg(e.target.files[0])}
							hidden
						/>
						<Button
							disableRipple
							variant='string'
							component='label'
							className='disableHover noTextTrans'
							htmlFor='editChangePhoto'
						>
							Change Profile Photo
						</Button>
					</section>

					<form>
						<label>
							<span>Name</span>
							<div>
								<TextField type='text' placeholder='Name' fullWidth />
								<p className='greyText'>
									Help people discover your account by using the name you're
									known by: either your full name, nickname, or business name.
									You can only change your name twice within 14 days.
								</p>
							</div>
						</label>

						<label>
							<span>Username</span>
							<div>
								<TextField
									fullWidth
									type='text'
									disabled
									placeholder={loggedInUser.username}
								/>
								<p className='greyText'>
									In most cases, you'll be able to change your username back to
									undefined for another undefined days.
									<Button
										disableRipple
										variant='text'
										className='disableHover noTextTrans'
									>
										Learn more.
									</Button>
								</p>
							</div>
						</label>

						<label>
							<span>Website</span>
							<TextField
								type='text'
								disabled
								placeholder='http://wwww.simpleChat.com'
							/>
						</label>

						<label>
							<span>Description</span>
							<TextField placeholder='Description' />
						</label>
						<label>
							<span></span>
							<div className='greyText'>
								<h6>Personal Information</h6>
								<p>
									Provide your personal information, even if the account is used
									for a business, a pet or something else. This won't be a part
									of your public profile.
								</p>
							</div>
						</label>

						<label>
							<span>Email</span>
							<TextField
								type='email'
								disabled
								placeholder='example@email.com'
							/>
						</label>

						<label>
							<span>Phone Number</span>
							<TextField type='text' disabled placeholder='Phone Number' />
						</label>

						<label>
							<span>Gender</span>
							<TextField type='text' disabled placeholder='Gender' />
						</label>

						<label>
							<span>Similar Account Suggestions</span>
							<div>
								<Checkbox
									sx={{ float: 'left' }}
									disableRipple
									disabled
									defaultChecked
								/>
								<h6>
									Include your account when recommending similar accounts people
									might want to follow.
								</h6>
							</div>
						</label>

						<label id='bottom'>
							<span></span>
							<div>
								<Button
									variant='contained'
									className='noTextTrans'
									onClick={() => console.log('gii')}
								>
									Submit
								</Button>

								<Button
									sx={{ float: 'right' }}
									disableRipple
									className='disableHover noTextTrans'
								>
									Temporariliy disable my account
								</Button>
							</div>
						</label>
					</form>
				</TabPanel>
				<TabPanel value={value} index={1}></TabPanel>
				<TabPanel value={value} index={2}></TabPanel>
				<TabPanel value={value} index={3}></TabPanel>
				<TabPanel value={value} index={4}></TabPanel>
				<TabPanel value={value} index={5}></TabPanel>
				<TabPanel value={value} index={6}></TabPanel>
				<TabPanel value={value} index={7}></TabPanel>
				<TabPanel value={value} index={8}></TabPanel>
				<TabPanel value={value} index={9}></TabPanel>
				<TabPanel value={value} index={10}></TabPanel>
				<TabPanel value={value} index={11}></TabPanel>
			</Card>
		</main>
	);
}
