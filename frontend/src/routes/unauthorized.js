import { Outlet, Routes, Route } from 'react-router-dom';
import CreateAccount from '../pages/unauthenticated/CreateAccount';
import ForgotPassword from '../pages/unauthenticated/ForgotPassword';
import Landing from '../pages/unauthenticated/Landing';
import NotFound from '../pages/NotFound';

import { Button, ButtonGroup } from '@mui/material';
import './unauthorized.css';

function Base() {
	return (
		<div className='unauthorizedBase'>
			<Outlet />
			<footer>
				<ButtonGroup size='small' variant='text'>
					<Button>About</Button>
					<Button>Help</Button>
					<Button>Api</Button>
					<Button>Press</Button>
					<Button>Jobs</Button>
					<Button>Privacy</Button>
					<Button>Terms</Button>
					<Button>Locations</Button>
					<Button>Top Accounts</Button>
					<Button>Hashtags</Button>
					<Button>Language</Button>
				</ButtonGroup>
				<p>© 2022 SIMPLECHAT FROM OO</p>
			</footer>
		</div>
	);
}
export default function UnauthorizedRoutes(props) {
	const { setLoggedInUser } = props;
	return (
		<Routes>
			<Route path='/' element={<Base />}>
				<Route index element={<Landing setLoggedInUser={setLoggedInUser} />} />
				<Route path='/createAccount' element={<CreateAccount />} />
				<Route path='/forgotPassword' element={<ForgotPassword />} />

				<Route path='*' element={<NotFound />} />
			</Route>
		</Routes>
	);
}
