import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function Tab4() {
	return (
		<>
			<FormControl>
				<FormLabel>Likes</FormLabel>
				<RadioGroup defaultValue='off'>
					<FormControlLabel value='off' control={<Radio />} label='Off' />
					<FormControlLabel
						value='from People I Follow'
						control={<Radio />}
						label='From People I Follow'
					/>
					<FormControlLabel
						value='from Everyone'
						control={<Radio />}
						label='From Everyone'
					/>
				</RadioGroup>
				<p className='greyText'>johnappleseed commented: "Nice shot!"</p>
			</FormControl>

			<FormControl>
				<FormLabel>Comments</FormLabel>
				<RadioGroup defaultValue='off'>
					<FormControlLabel value='off' control={<Radio />} label='Off' />
					<FormControlLabel
						value='from People I Follow'
						control={<Radio />}
						label='From People I Follow'
					/>
					<FormControlLabel
						value='from Everyone'
						control={<Radio />}
						label='From Everyone'
					/>
				</RadioGroup>
				<p className='greyText'>
					johnappleseed liked your comment: "Nice shot!"
				</p>
			</FormControl>

			<FormControl>
				<FormLabel>Comments Likes</FormLabel>
				<RadioGroup defaultValue='off'>
					<FormControlLabel value='off' control={<Radio />} label='Off' />
					<FormControlLabel
						value='from People I Follow'
						control={<Radio />}
						label='From People I Follow'
					/>
				</RadioGroup>
				<p className='greyText'>
					johnappleseed liked your comment: "Nice shot!"
				</p>
			</FormControl>

			<FormControl>
				<FormLabel>Likes and Comments on Photos of You</FormLabel>
				<RadioGroup defaultValue='off'>
					<FormControlLabel value='off' control={<Radio />} label='Off' />
					<FormControlLabel
						value='from People I Follow'
						control={<Radio />}
						label='From People I Follow'
					/>
				</RadioGroup>
				<p className='greyText'>
					johnappleseed commented on a post you're tagged in.
				</p>
			</FormControl>

			<FormControl>
				<FormLabel>Accepted Follow Requests</FormLabel>
				<RadioGroup defaultValue='off'>
					<FormControlLabel value='off' control={<Radio />} label='Off' />
					<FormControlLabel
						value='from Everyone'
						control={<Radio />}
						label='From Everyone'
					/>
				</RadioGroup>
				<p className='greyText'>
					John Appleseed (johnappleseed) accepted your follow request.
				</p>
			</FormControl>

			<FormControl>
				<FormLabel>Instagram Direct Requests</FormLabel>
				<RadioGroup defaultValue='off'>
					<FormControlLabel value='off' control={<Radio />} label='Off' />
					<FormControlLabel
						value='from Everyone'
						control={<Radio />}
						label='From Everyone'
					/>
				</RadioGroup>
				<p className='greyText'>johnappleseed sent you a message.</p>
			</FormControl>

			<FormControl>
				<FormLabel>Reminders</FormLabel>
				<RadioGroup defaultValue='off'>
					<FormControlLabel value='off' control={<Radio />} label='Off' />
					<FormControlLabel
						value='from Everyone'
						control={<Radio />}
						label='From Everyone'
					/>
				</RadioGroup>
				<p className='greyText'>
					You have unseen notifications, and other similar notifications.
				</p>
			</FormControl>

			<FormControl>
				<FormLabel>First Posts and Stories</FormLabel>
				<RadioGroup defaultValue='off'>
					<FormControlLabel value='off' control={<Radio />} label='Off' />
					<FormControlLabel
						value='from People I Follow'
						control={<Radio />}
						label='From People I Follow'
					/>
					<FormControlLabel
						value='from Everyone'
						control={<Radio />}
						label='From Everyone'
					/>
				</RadioGroup>
				<p className='greyText'>
					See johnappleseed's first story on Instagram, and other similar
					notifications.
				</p>
			</FormControl>

			<FormControl>
				<FormLabel>Video View Counts</FormLabel>
				<RadioGroup defaultValue='off'>
					<FormControlLabel value='off' control={<Radio />} label='Off' />
					<FormControlLabel
						value='from Everyone'
						control={<Radio />}
						label='From Everyone'
					/>
				</RadioGroup>
				<p className='greyText'>Your video has more than 100K views.</p>
			</FormControl>

			<FormControl>
				<FormLabel>Support Requests</FormLabel>
				<RadioGroup defaultValue='off'>
					<FormControlLabel value='off' control={<Radio />} label='Off' />
					<FormControlLabel
						value='from Everyone'
						control={<Radio />}
						label='From Everyone'
					/>
				</RadioGroup>
				<p className='greyText'>
					Your support request from July 10 was just updated.
				</p>
			</FormControl>

			<FormControl>
				<FormLabel>Live Videos</FormLabel>
				<RadioGroup defaultValue='off'>
					<FormControlLabel value='off' control={<Radio />} label='Off' />
					<FormControlLabel value='on' control={<Radio />} label='On' />
				</RadioGroup>
				<p className='greyText'>
					johnappleseed started a live video. Watch it before it ends!
				</p>
			</FormControl>
		</>
	);
}
