import { useEffect, useState, createContext } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from '../pages/authenticated/Home';
import Profile from '../pages/authenticated/Profile';
import OtherProfile from '../pages/authenticated/OtherProfile';
import EditProfile from '../pages/authenticated/EditProfile';
import NavBar from './NavBar';
import NotFound from '../pages/NotFound';
import './authorized.css';

import { io } from 'socket.io-client';

function Base(props) {
	const {
		userData,
		setUserData,
		userPosts,
		setUserPosts,
		followingPosts,
		socket,
		homeFeed,
		setHomeFeed,
	} = props;
	return (
		<div className='authorizedBase'>
			<NavBar
				homeFeed={homeFeed}
				setHomeFeed={setHomeFeed}
				userData={userData}
				socket={socket}
			/>
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
export const SocketContext = createContext();
export default function AuthorizedRoutes() {
	const [userData, setUserData] = useState({});
	const [homeFeed, setHomeFeed] = useState({});
	const [socket, setSocket] = useState();

	const controller = new AbortController();
	const signal = controller.signal;

	useEffect(() => {
		setSocket(io());
		fetch(`/api/user`, { signal })
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ data }) => {
				setUserData(data);
				return;
			});

		fetch(`/api/post/all`, { signal })
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ posts }) => {
				setHomeFeed(posts);
				return;
			});

		return () => {
			controller.abort();
		};
	}, []);

	return (
		<Routes>
			<Route
				path='/'
				element={
					<Base socket={socket} userData={userData} setUserData={setUserData} />
				}
			>
				<Route
					index
					element={<Home homeFeed={homeFeed} setHomeFeed={setHomeFeed} />}
				/>
				<Route path='profile' element={<Profile />} />
				<Route path='profile/:otherUser' element={<OtherProfile />} />
				<Route path='edit' element={<EditProfile />} />
				<Route path='*' element={<NotFound />} />
			</Route>
		</Routes>
	);
}
