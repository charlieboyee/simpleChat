import { useEffect, useState } from 'react';
import { useSelector, useOutletContext } from 'react-router-dom';
import {
	Avatar,
	Button,
	Card,
	CardHeader,
	CardActions,
	CardMedia,
	CardContent,
	TextField,
	Input,
} from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import './design/home.css';

export default function Home() {
	const [comment, setComment] = useState('');
	const { userPosts, userData } = useOutletContext();
	const [posts] = userPosts;
	const [data] = userData;

	return (
		<main id='homePage'>
			{posts.map((post, index) => {
				return (
					<Card key={index}>
						<CardHeader
							avatar={
								<Avatar
									src={`${process.env.REACT_APP_S3_URL}${data.profilePhoto}`}
								/>
							}
							title={post.owner}
						/>
						<CardMedia>
							<img
								id='postImage'
								src={`${process.env.REACT_APP_S3_URL}${post.photo}`}
								alt='post'
							/>
						</CardMedia>
						<CardContent>
							<FavoriteBorderRoundedIcon />
							<div>{post.likes} likes</div>
							<div>{post.caption}</div>
						</CardContent>
						<CardActions>
							<Input
								disableUnderline
								endAdornment={<Button>Comment</Button>}
								fullWidth
								placeholder='Comment'
								value={comment}
								onChange={(e) => setComment(e.target.value)}
							/>
						</CardActions>
					</Card>
				);
			})}
		</main>
	);
}
