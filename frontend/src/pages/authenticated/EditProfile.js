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

function AppsAndWebsitesTabs() {
	const [value, setValue] = useState(0);

	const handleChange = (e, newValue) => {
		setValue(newValue);
	};
	return (
		<>
			<header>Apps and Websites</header>
			<Tabs onChange={handleChange} value={value} fullWidth centered>
				<Tab label='Active' />
				<Tab label='Expired' />
				<Tab label='Removed' />
			</Tabs>
			<TabPanel inner='innerTab' value={value} index={0}>
				<p>
					These are apps and websites you've connected to your Instagram
					account. They can access non-public information that you choose to
					share with them.
				</p>
				<p>
					You have not authorized any applications to access your Instagram
					account.
				</p>
			</TabPanel>
			<TabPanel inner='innerTab' value={value} index={1}>
				<p>
					These are apps and websites you've connected to your Instagram account
					that you may not have used in the last 90 days. They're no longer able
					to access your non-public information, but may still have the
					information you shared while they were active. "Non-public" means
					information that an app can only access if you choose to share it when
					you log in with your Instagram account (like your email address).
				</p>
				<p>
					You have no expired applications that had access to your Instagram
					account.
				</p>
			</TabPanel>
			<TabPanel inner='innerTab' value={value} index={2}>
				<p>
					These are apps and websites that are no longer connected to your
					Instagram account. They can't access your non-public information
					anymore, but may still have the information you shared while they were
					active. "Non-public" means information that an app can only access if
					you choose to share it when you log in with your Instagram account
					(like your email address). You can ask an app to delete your
					information. To do it, review their Privacy Policy for details and
					contact information. If you contact an app, they may need your User
					ID.
				</p>
				<p>
					You have no removed applications that had access to your Instagram
					account.
				</p>
			</TabPanel>
		</>
	);
}

function TabPanel({ children, value, index, inner = '' }) {
	return (
		<div
			value={value}
			className={value !== index ? `tabPanel hidden` : `tabPanel ${inner}`}
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
				<Tabs
					orientation='vertical'
					value={value}
					onChange={handleChange}
					TabIndicatorProps={{ style: { left: 0, width: '.2rem' } }}
					sx={{ borderRight: 'solid 1px black' }}
				>
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

						<label className='bottom'>
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
				<TabPanel value={value} index={1}>
					<section>
						<Avatar
							src={
								loggedInUser.profilePhoto &&
								`${process.env.REACT_APP_S3_URL}${loggedInUser.profilePhoto}`
							}
						/>
						<div>{loggedInUser.username}</div>
					</section>
					<form>
						<label>
							<span>Old Password</span>
							<TextField type='password' placeholder='Phone Number' />
						</label>
						<label>
							<span>New Password</span>
							<TextField type='password' placeholder='Phone Number' />
						</label>
						<label>
							<span>Confirm New Password</span>
							<TextField type='password' placeholder='Phone Number' />
						</label>
						<label className='bottom'>
							<span></span>
							<div>
								<Button
									sx={{ display: 'block' }}
									className='noTextTrans disableHover'
									onClick={() => console.log('hi')}
								>
									Change Password
								</Button>
								<Button className='noTextTrans disableHover'>
									Forgot Password?
								</Button>
							</div>
						</label>
					</form>
				</TabPanel>
				<TabPanel value={value} index={2}>
					<AppsAndWebsitesTabs />
				</TabPanel>
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
