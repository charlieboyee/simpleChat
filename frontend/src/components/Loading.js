import CircularProgress from '@mui/material/CircularProgress';
import './design/loading.css';

export default function Loading() {
	return (
		<div id='loading'>
			<CircularProgress size={300} sx={{ color: 'white' }} />

			<div>Loading...</div>
		</div>
	);
}
