import { useState } from 'react';
import { Avatar, Button, Checkbox, IconButton, TextField } from '@mui/material';

export default function Tab0({ loggedInUser }) {
	const [img, setImg] = useState(null);
	return (
		<>
			<section>
				<span>
					<IconButton disableRipple component='label' htmlFor='editChangePhoto'>
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
				<span>
					<Button
						disableRipple
						variant='string'
						component='label'
						className='disableHover noTextTrans'
						htmlFor='editChangePhoto'
					>
						Change Profile Photo
					</Button>
				</span>
			</section>

			<form>
				<label>
					<span>Name</span>
					<div>
						<TextField type='text' placeholder='Name' fullWidth />
						<p className='greyText'>
							Help people discover your account by using the name you're known
							by: either your full name, nickname, or business name. You can
							only change your name twice within 14 days.
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
							Provide your personal information, even if the account is used for
							a business, a pet or something else. This won't be a part of your
							public profile.
						</p>
					</div>
				</label>

				<label>
					<span>Email</span>
					<TextField type='email' disabled placeholder='example@email.com' />
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
							onClick={() => console.log('hi')}
						>
							Temporariliy disable my account
						</Button>
					</div>
				</label>
			</form>
		</>
	);
}
