import { Outlet, Routes, Route } from 'react-router-dom';
import CreateAccount from '../pages/unauthenticated/CreateAccount';
import ForgotPassword from '../pages/unauthenticated/ForgotPassword';
import Landing from '../pages/unauthenticated/Landing';
import NotFound from '../pages/NotFound';
import './unauthorized.css';

function Base() {
	return (
		<div className='unauthorizedBase'>
			<Outlet />
		</div>
	);
}
export default function UnauthorizedRoutes() {
	return (
		<Routes>
			<Route path='/' element={<Base />}>
				<Route index element={<Landing />} />
				<Route path='/createAccount' element={<CreateAccount />} />
				<Route path='/forgotPassword' element={<ForgotPassword />} />

				<Route path='*' element={<NotFound />} />
			</Route>
		</Routes>
	);
}
