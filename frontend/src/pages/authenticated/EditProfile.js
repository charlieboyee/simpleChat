import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Footer from '../../components/Footer';
import * as EditProfileTab from './editProfileTabs';
import { Button, Card, Tab, Tabs } from '@mui/material';
import './design/editProfile.css';

function TabPanel({ children, value, index }) {
	return (
		<div
			value={value}
			className={value !== index ? `tabPanel hidden` : `tabPanel`}
		>
			{children}
		</div>
	);
}

function InnerTabPanel({ children, value, index, outerValue }) {
	return (
		<div
			value={value}
			className={
				value !== index && outerValue !== 2
					? `innerTabPanel hidden`
					: `innerTabPanel`
			}
		>
			{children}
		</div>
	);
}

function EmailsFromSimpleChat() {
	const [value, setValue] = useState(0);

	const handleChange = (e, newValue) => {
		setValue(newValue);
	};
	return (
		<>
			<header>Emails From SimpleChat</header>
			<Tabs
				id='innerTabs'
				onChange={handleChange}
				value={value}
				variant='fullWidth'
				centered
			>
				<Tab className='noTextTrans disableHover' label='Security' />
				<Tab className='noTextTrans disableHover' label='Other' />
			</Tabs>
			<InnerTabPanel value={value} index={0}>
				<p>
					Security and login emails from Instagram in the last 14 days will
					appear here. You can use it to verify which emails are real and which
					are fake.
					<Button className='disableHover noTextTrans'>Learn more.</Button>
				</p>
			</InnerTabPanel>
			<InnerTabPanel value={value} index={1}>
				<p>
					Other emails from Instagram in the last 14 days that aren't about
					security or login will appear here. You can use it to verify which
					emails are real and which are fake. Learn more.
					<Button className='disableHover noTextTrans'>Learn more.</Button>
				</p>
			</InnerTabPanel>
		</>
	);
}

function AppsAndWebsitesTabs({ outerValue }) {
	const [value, setValue] = useState(0);

	const handleChange = (e, newValue) => {
		setValue(newValue);
	};
	return (
		<>
			<header>Apps and Websites</header>
			<Tabs
				id='innerTabs'
				onChange={handleChange}
				value={value}
				variant='fullWidth'
				centered
			>
				<Tab className='noTextTrans disableHover' label='Active' />
				<Tab className='noTextTrans disableHover' label='Expired' />
				<Tab className='noTextTrans disableHover' label='Removed' />
			</Tabs>
			<InnerTabPanel value={value} index={0}>
				<p>
					These are apps and websites you've connected to your Instagram
					account. They can access non-public information that you choose to
					share with them.
				</p>
				<p>
					You have not authorized any applications to access your Instagram
					account.
				</p>
			</InnerTabPanel>
			<InnerTabPanel value={value} index={1}>
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
			</InnerTabPanel>
			<InnerTabPanel value={value} index={2}>
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
			</InnerTabPanel>
		</>
	);
}

export default function EditProfile() {
	const { userData } = useOutletContext();
	const [loggedInUser] = userData;

	const [value, setValue] = useState(0);

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
					<Tab
						disableRipple
						className='noTextTrans disableHover'
						label='Edit Proflie'
					/>
					<Tab
						disableRipple
						className='noTextTrans disableHover'
						label='Change Password'
					/>
					<Tab
						disableRipple
						className='noTextTrans disableHover'
						label='Apps and Websites'
					/>
					<Tab
						disableRipple
						className='noTextTrans disableHover'
						label='Email Notifications'
					/>
					<Tab
						disableRipple
						className='noTextTrans disableHover'
						label='Push Notifications'
					/>
					<Tab
						disableRipple
						className='noTextTrans disableHover'
						label='Manage Contacts'
					/>
					<Tab
						disableRipple
						className='noTextTrans disableHover'
						label='Privacy and Security'
					/>
					<Tab
						disableRipple
						className='noTextTrans disableHover'
						label='Supervision'
					/>
					<Tab
						disableRipple
						className='noTextTrans disableHover'
						label='Login Activity'
					/>
					<Tab
						disableRipple
						className='noTextTrans disableHover'
						label='Emails from SimpleChat'
					/>
					<Tab
						disableRipple
						className='noTextTrans disableHover'
						label='Help'
					/>
				</Tabs>
				<TabPanel value={value} index={0}>
					<EditProfileTab.Tab0 loggedInUser={loggedInUser} />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<EditProfileTab.Tab1 loggedInUser={loggedInUser} />
				</TabPanel>
				<TabPanel value={value} index={2}>
					<AppsAndWebsitesTabs outerValue={2} />
				</TabPanel>
				<TabPanel value={value} index={3}>
					<EditProfileTab.Tab3 />
				</TabPanel>
				<TabPanel value={value} index={4}>
					<EditProfileTab.Tab4 />
				</TabPanel>
				<TabPanel value={value} index={5}>
					<EditProfileTab.Tab5 />
				</TabPanel>
				<TabPanel value={value} index={6}>
					<EditProfileTab.Tab6 />
				</TabPanel>
				<TabPanel value={value} index={7}>
					<EditProfileTab.Tab7 />
				</TabPanel>
				<TabPanel value={value} index={8}></TabPanel>
				<TabPanel value={value} index={9}>
					<EmailsFromSimpleChat />
				</TabPanel>
				<TabPanel value={value} index={10}>
					<EditProfileTab.Tab10 />
				</TabPanel>
			</Card>
			<Footer />
		</main>
	);
}
