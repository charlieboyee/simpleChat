import { useEffect, useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from '../pages/authenticated/Home';
import Profile from '../pages/authenticated/Profile';
import EditProfile from '../pages/authenticated/EditProfile';
import NavBar from './NavBar';
import NotFound from '../pages/NotFound';
import './authorized.css';

function Base(props) {
	const { userData, setUserData, userPosts, setUserPosts } = props;
	return (
		<div className='authorizedBase'>
			<NavBar userData={userData} setUserData={setUserData} />
			<Outlet
				context={{
					userData: [userData, setUserData],
					userPosts: [userPosts, setUserPosts],
				}}
			/>
		</div>
	);
}

export default function AuthorizedRoutes() {
	const [userData, setUserData] = useState({});
	const [userPosts, setUserPosts] = useState([]);

	useEffect(() => {
		fetch('/api/user/data')
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ data }) => {
				setUserData(data);
				return;
			});
		fetch('/api/user/posts')
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ posts }) => {
				setUserPosts(posts);
				return;
			});
	}, []);

	return (
		<Routes>
			<Route
				path='/'
				element={
					<Base
						userData={userData}
						setUserData={setUserData}
						userPosts={userPosts}
						setUserPosts={setUserPosts}
					/>
				}
			>
				<Route index element={<Home />} />
				<Route path='profile' element={<Profile />} />
				<Route path='edit' element={<EditProfile />} />
				<Route path='*' element={<NotFound />} />
			</Route>
		</Routes>
	);
}
