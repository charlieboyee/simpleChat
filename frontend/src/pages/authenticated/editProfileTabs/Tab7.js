import { Button } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

export default function Tab7() {
	return (
		<>
			<section>
				<header>Supervision</header>
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
				Family Center
			</Button>
			<Button
				disableRipple
				sx={{ justifyContent: 'space-between' }}
				endIcon={<ChevronRightRoundedIcon />}
				className='noTextTrans disableHover'
			>
				Education Hub
			</Button>
		</>
	);
}
