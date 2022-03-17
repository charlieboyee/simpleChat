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

	const { userData } = useOutletContext();
	const [data] = userData;

	const [comment, setComment] = useState('');

	if (homeFeed.length) {
		return (
			<main id='homePage'>
				{homeFeed?.map((post, index) => {
					return (
						<Card key={index}>
							<CardHeader
								avatar={
									<Avatar
										src={
											data.profilePhoto
												? `${process.env.REACT_APP_S3_URL}${data.profilePhoto}`
												: null
										}
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
	return <CircularProgress />;
}
