import { useEffect, useState } from 'react';
import { useSelector, useOutletContext } from 'react-router-dom';
import {
	Avatar,
	Card,
	CardHeader,
	CardActions,
	CardMedia,
	CardContent,
	TextField,
} from '@mui/material';

export default function Home() {
	const [comment, setComment] = useState('');
	const { userPosts } = useOutletContext();
	const [posts] = userPosts;

	return (
		<div>
			{posts.map((post, index) => {
				return (
					<Card key={index}>
						<CardMedia>
							<img
								src={`${process.env.REACT_APP_S3_URL}${post.photo}`}
								alt='post'
							/>
						</CardMedia>
						<CardContent></CardContent>
						<CardActions>
							<TextField
								value={comment}
								onChange={(e) => setComment(e.target.value)}
							/>
						</CardActions>
					</Card>
				);
			})}
		</div>
	);
}
