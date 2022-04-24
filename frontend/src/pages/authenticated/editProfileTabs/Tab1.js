import { Avatar, Button, IconButton, TextField } from '@mui/material';
export default function Tab1({ loggedInUser }) {
	return (
		<>
			<section>
				<span>
					<IconButton>
						<Avatar
							src={
								loggedInUser.profilePhoto &&
								`${process.env.REACT_APP_S3_URL}${loggedInUser.profilePhoto}`
							}
						/>
					</IconButton>
				</span>
				<span style={{ paddingLeft: '1rem' }}>{loggedInUser.username}</span>
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
		</>
	);
}
