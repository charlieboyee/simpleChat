import { useEffect, useState, createContext } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import * as Page from '../pages/authenticated';
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
		notificationCount,
		setNotificationCount,
		setHomeFeed,
	} = props;
	return (
		<div className='authorizedBase'>
			<NavBar
				homeFeed={homeFeed}
				setHomeFeed={setHomeFeed}
				userData={userData}
				socket={socket}
				notificationCount={notificationCount}
				setNotificationCount={setNotificationCount}
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
	const [notificationCount, setNotificationCount] = useState(0);

	const controller = new AbortController();
	const signal = controller.signal;

	useEffect(() => {
		setSocket(io());
		fetch('/api/notifications/count', { signal })
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(({ count }) => setNotificationCount(count));
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
				posts.forEach((post) => {
					post.comments.reverse();
				});
				console.log(posts);
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
					<Base
						notificationCount={notificationCount}
						setNotificationCount={setNotificationCount}
						socket={socket}
						userData={userData}
						setUserData={setUserData}
					/>
				}
			>
				<Route
					index
					element={
						<Page.Home
							setNotificationCount={setNotificationCount}
							homeFeed={homeFeed}
							setHomeFeed={setHomeFeed}
						/>
					}
				/>

				<Route path='edit' element={<Page.EditProfile />} />
				<Route path='inbox' element={<Page.Inbox />} />
				<Route path='profile' element={<Page.Profile />} />
				<Route path='profile/:otherUser' element={<Page.OtherProfile />} />
				<Route path='*' element={<NotFound />} />
			</Route>
		</Routes>
	);
}
