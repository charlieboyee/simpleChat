import { useEffect, useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from '../pages/authenticated/Home';
import Profile from '../pages/authenticated/Profile';
import OtherProfile from '../pages/authenticated/OtherProfile';
import EditProfile from '../pages/authenticated/EditProfile';
import NavBar from './NavBar';
import NotFound from '../pages/NotFound';
import './authorized.css';

function Base(props) {
	const { userData, setUserData, userPosts, setUserPosts, followingPosts } =
		props;
	return (
		<div className='authorizedBase'>
			<NavBar userData={userData} setUserData={setUserData} />
			<Outlet
				context={{
					followingPosts,
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
	const [followingPosts, setFollowingPosts] = useState([]);

	useEffect(() => {
		fetch(`/api/user/data`)
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
		fetch('/api/posts')
			.then((result) => result.json())
			.then(({ posts }) => setFollowingPosts(posts));
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
						followingPosts={followingPosts}
					/>
				}
			>
				<Route index element={<Home />} />
				<Route path='profile' element={<Profile />} />
				<Route path='profile/:otherUser' element={<OtherProfile />} />
				<Route path='edit' element={<EditProfile />} />
				<Route path='*' element={<NotFound />} />
			</Route>
		</Routes>
	);
}
