import {
	Button,
	Checkbox,
	FormGroup,
	FormControl,
	FormControlLabel,
	FormLabel,
	RadioGroup,
	Radio,
} from '@mui/material';

export default function Tab6() {
	return (
		<>
			<FormGroup>
				<FormLabel>Account Privacy</FormLabel>

				<FormControlLabel
					control={<Checkbox defaultChecked />}
					label='Private Account'
				/>

				<p className='greyText'>
					When your account is private, only people you approve can see your
					photos and videos on Instagram. Your existing followers won't be
					affected.
				</p>
			</FormGroup>

			<FormGroup>
				<FormLabel>Activity Status</FormLabel>

				<FormControlLabel
					control={<Checkbox defaultChecked />}
					label='Show Activity Status'
				/>

				<p className='greyText'>
					When your account is private, only people you approve can see your
					photos and videos on Instagram. Your existing followers won't be
					affected.
					<Button disableRipple className='disableHover noTextTrans'>
						Learn more
					</Button>
				</p>
				<p className='greyText'>
					You can continue to use our services if active status is off.
				</p>
			</FormGroup>

			<FormGroup>
				<FormLabel>Story Sharing</FormLabel>

				<FormControlLabel
					control={<Checkbox defaultChecked />}
					label='Allow Sharing'
				/>

				<p className='greyText'>Let people share your story as messages.</p>
			</FormGroup>
			<FormGroup>
				<FormLabel>Comments</FormLabel>
				<Button
					sx={{ justifyContent: 'flex-start', width: 'max-content' }}
					className='disableHover noTextTrans'
					disableRipple
				>
					Edit Comment Settings
				</Button>
			</FormGroup>
			<FormGroup>
				<FormLabel>Two-Factor Authentication</FormLabel>
				<Button
					sx={{ justifyContent: 'flex-start', width: 'max-content' }}
					className='disableHover noTextTrans'
					disableRipple
				>
					Edit Two-Factor Authentication Setting
				</Button>
			</FormGroup>
			<FormGroup>
				<FormLabel>Data Download</FormLabel>
				<Button
					sx={{ justifyContent: 'flex-start', width: 'max-content' }}
					className='disableHover noTextTrans'
					disableRipple
				>
					Request Download
				</Button>
			</FormGroup>
			<FormGroup>
				<FormLabel>Privacy and Security Help</FormLabel>
				<Button
					sx={{ justifyContent: 'flex-start', width: 'max-content' }}
					className='disableHover noTextTrans'
					disableRipple
				>
					Support
				</Button>
			</FormGroup>
		</>
	);
}
