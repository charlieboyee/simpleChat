import { Button } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

export default function Tab10() {
	return (
		<>
			<section>
				<header>Help</header>
			</section>
			<Button
				disableRipple
				sx={{
					justifyContent: 'space-between',
				}}
				fullWidth
				endIcon={<ChevronRightRoundedIcon />}
				className='noTextTrans disableHover'
			>
				Help Center
			</Button>
			<Button
				disableRipple
				sx={{ justifyContent: 'space-between' }}
				endIcon={<ChevronRightRoundedIcon />}
				className='noTextTrans disableHover'
			>
				Privacy and Security Help
			</Button>
			<Button
				disableRipple
				sx={{ justifyContent: 'space-between' }}
				endIcon={<ChevronRightRoundedIcon />}
				className='noTextTrans disableHover'
			>
				Support Requests
			</Button>
		</>
	);
}
