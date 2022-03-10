import { useEffect, useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from '../pages/authenticated/Home';
import Profile from '../pages/authenticated/Profile';
import EditProfile from '../pages/authenticated/EditProfile';
import NavBar from './NavBar';
import NotFound from '../pages/NotFound';
import './authorized.css';

function Base(props) {
	const { userData, setUserData } = props;
	return (
		<div className='authorizedBase'>
			<NavBar userData={userData} setUserData={setUserData} />
			<Outlet context={[userData, setUserData]} />
		</div>
	);
}

export default function AuthorizedRoutes() {
	const [userData, setUserData] = useState({});

	useEffect(() => {
		(async () => {
			const result = await fetch('/api/user/data');
			if (result.status === 200) {
				let { data } = await result.json();
				if (data) {
					setUserData(data);
					return;
				}
			}
		})();
	}, []);

	useEffect(() => {
		console.log(userData);
	}, [userData]);
	return (
		<Routes>
			<Route
				path='/'
				element={<Base userData={userData} setUserData={setUserData} />}
			>
				<Route index element={<Home />} />
				<Route path='profile' element={<Profile />} />
				<Route path='edit' element={<EditProfile />} />
				<Route path='*' element={<NotFound />} />
			</Route>
		</Routes>
	);
}
