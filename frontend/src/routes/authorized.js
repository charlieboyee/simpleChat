import { useEffect, useState, useContext } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { SocketContext } from '../index';
import * as Page from '../pages/authenticated';
import NavBar from './NavBar';
import NotFound from '../pages/NotFound';
import './authorized.css';
import sio from '../sio';

function Base(props) {
	const {
		allMessages,
		userData,
		setUserData,
		userPosts,
		setUserPosts,
		followingPosts,
		homeFeed,
		notificationCount,
		setNotificationCount,
		setHomeFeed,
		setAllMessages,
	} = props;
	return (
		<div className='authorizedBase'>
			<NavBar
				homeFeed={homeFeed}
				setHomeFeed={setHomeFeed}
				userData={userData}
				notificationCount={notificationCount}
				setNotificationCount={setNotificationCount}
				allMessages={allMessages}
				setAllMessages={setAllMessages}
			/>
			<Outlet
				context={{
					followingPosts,
					userData: [userData, setUserData],
					userPosts: [userPosts, setUserPosts],
					allMessages,
					setAllMessages,
				}}
			/>
		</div>
	);
}

export default function AuthorizedRoutes() {
	const [socket, setSocket] = useContext(SocketContext);

	const [userData, setUserData] = useState({});
	const [homeFeed, setHomeFeed] = useState({});
	const [notificationCount, setNotificationCount] = useState(0);
	const [allMessages, setAllMessages] = useState([]);

	const controller = new AbortController();
	const signal = controller.signal;

	useEffect(() => {
		if (userData.username) {
			setSocket(sio(userData));
		}
	}, [userData.username]);

	useEffect(() => {
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
				setHomeFeed(posts);
				return;
			});

		return () => {
			controller.abort();
		};
	}, []);

	if (!socket) {
		return <div>no socket</div>;
	}
	return (
		<Routes>
			<Route
				path='/'
				element={
					<Base
						notificationCount={notificationCount}
						setNotificationCount={setNotificationCount}
						userData={userData}
						setUserData={setUserData}
						allMessages={allMessages}
						setAllMessages={setAllMessages}
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
