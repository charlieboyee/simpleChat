import { Outlet, Routes, Route } from 'react-router-dom';
import CreateAccount from '../pages/unauthenticated/CreateAccount';
import ForgotPassword from '../pages/unauthenticated/ForgotPassword';
import Landing from '../pages/unauthenticated/Landing';
import NotFound from '../pages/NotFound';
import Footer from '../components/Footer';
import './unauthorized.css';

function Base() {
	return (
		<div className='unauthorizedBase'>
			<Outlet />
			<Footer />
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
