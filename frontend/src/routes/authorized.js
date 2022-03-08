import { Routes, Route, Outlet } from 'react-router-dom';
import Home from '../pages/authenticated/Home';
import Profile from '../pages/authenticated/Profile';
import EditProfile from '../pages/authenticated/EditProfile';
import NavBar from './NavBar';
import NotFound from '../pages/NotFound';
import './authorized.css';

function Base() {
	return (
		<div className='authorizedBase'>
			<NavBar />
			<Outlet />
		</div>
	);
}

export default function AuthorizedRoutes() {
	return (
		<Routes>
			<Route path='/' element={<Base />}>
				<Route index element={<Home />} />
				<Route path='profile' element={<Profile />} />
				<Route path='edit' element={<EditProfile />} />
				<Route path='*' element={<NotFound />} />
			</Route>
		</Routes>
	);
}
