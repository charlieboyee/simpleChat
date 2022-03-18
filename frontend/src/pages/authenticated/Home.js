import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
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
	CircularProgress,
} from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import './design/home.css';

export default function Home(props) {
	const { homeFeed } = props;
	const [comment, setComment] = useState('');

	if (homeFeed.length) {
		return (
			<main id='homePage'>
				{homeFeed?.map((post, index) => {
					console.log(post.owner[0].profilePhoto);
					return (
						<Card key={index}>
							<CardHeader
								avatar={
									<Avatar
										src={
											post.owner[0].profilePhoto
												? `${process.env.REACT_APP_S3_URL}${post.owner[0].profilePhoto}`
												: null
										}
									/>
								}
								title={post.owner[0].username}
							/>
							<CardMedia>
								<img
									id='postImage'
									src={`${process.env.REACT_APP_S3_URL}${post.photo}`}
									alt='post'
								/>
							</CardMedia>
							<CardContent>
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
	return <CircularProgress />;
}
