import { useState, useEffect } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import {
	Avatar,
	Button,
	Card,
	CardMedia,
	CardContent,
	LinearProgress,
	Tab,
	Tabs,
} from '@mui/material';

import './design/otherProfile.css';

function TabPanel(props) {
	const { value, index, children } = props;
	return (
		<div className='tabPanel' hidden={value !== index}>
			{children}
		</div>
	);
}

export default function OtherProfile() {
	const { otherUser } = useParams();
	const navigate = useNavigate();

	const { userData } = useOutletContext();

	const [loggedInUser, setLoggedInUser] = userData;

	const [tabValue, setTabValue] = useState(0);

	const [otherUserData, setOtherUserData] = useState(null);
	const [loading, setLoading] = useState(true);

	const handleTabChange = (e, newValue) => setTabValue(newValue);

	const getOtherUserData = async () => {
		const result = await fetch(`/api/otherUser/${otherUser}`);
		if (result.status === 200) {
			const { data } = await result.json();
			return data;
		}
		return;
	};

	const followUser = async () => {
		const results = await fetch(`/api/otherUser/${otherUser}/follow`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ follower: loggedInUser.username }),
		});
		if (results.status === 200) {
			const { data } = await results.json();
			setLoggedInUser(data[1]);

			setOtherUserData((prev) => {
				let newArr = prev.slice(1);
				newArr.unshift(data[0]);
				return newArr;
			});

			return;
		}
	};

	useEffect(() => {
		if (otherUser === loggedInUser.username) {
			return navigate('/profile');
		}

		getOtherUserData().then((result) => {
			setOtherUserData(result);
			setLoading(false);
		});
	}, [otherUser]);

	if (loading) {
		return <LinearProgress />;
	}

	if (!loading) {
		if (!otherUserData) {
			return <div>user not found</div>;
		}
		return (
			<main id='otherProfile'>
				<section id='upperSection'>
					<Card>
						<CardMedia>
							{otherUserData.profilePhoto ? (
								<Avatar
									id='profilePhoto'
									src={`${process.env.REACT_APP_S3_URL}${otherUserData.profilePhoto}`}
								/>
							) : (
								<Avatar id='profilePhoto' />
							)}
						</CardMedia>
						<CardContent>
							<div>
								<div>
									<span>{otherUserData.username}</span>
									{loggedInUser.following?.includes(otherUser) ? (
										<Button variant='contained' disabled>
											Following
										</Button>
									) : (
										<Button variant='contained' onClick={followUser}>
											Follow
										</Button>
									)}
								</div>
								<div>
									<span>{otherUserData[1].length} posts</span>
									<span>{otherUserData[0].following.length} following</span>
									<span>{otherUserData[0].followers.length} followers</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</section>
				<section id='lowerSection'>
					<Tabs centered value={tabValue} onChange={handleTabChange}>
						<Tab label='Photos' />
						<Tab label='Videos' />
					</Tabs>
					<TabPanel value={tabValue} index={0}>
						{otherUserData[1].length ? (
							otherUserData[1].map((post, index) => {
								return (
									<img
										key={index}
										src={`${process.env.REACT_APP_S3_URL}${post.photo}`}
										alt='post'
									/>
								);
							})
						) : (
							<div>No posts yet</div>
						)}
					</TabPanel>
					<TabPanel value={tabValue} index={1}>
						videos
					</TabPanel>
				</section>
			</main>
		);
	}
}
