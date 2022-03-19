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
	Input,
	CircularProgress,
} from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import './design/home.css';

function CommentInput(props) {
	const { post, setHomeFeed, index } = props;
	const [comment, setComment] = useState('');

	const postComment = async (e, postId) => {
		e.preventDefault();

		const result = await fetch('/api/post/comment', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ comment, postId }),
		});
		if (result.status === 200) {
			const { data } = await result.json();
			setHomeFeed((prevState) => {
				data.owner = prevState[index].owner;
				prevState[index] = data;
				return [...prevState];
			});
			return;
		}
		return;
	};

	return (
		<form onSubmit={(e) => postComment(e, post._id)}>
			<Input
				disableUnderline
				endAdornment={<Button type='submit'>Comment</Button>}
				fullWidth
				placeholder='Comment'
				value={comment}
				onChange={(e) => setComment(e.target.value)}
			/>
		</form>
	);
}

export default function Home(props) {
	const { homeFeed, setHomeFeed } = props;

	const { userData } = useOutletContext();

	const [loggedInUser] = userData;

	if (homeFeed.length) {
		return (
			<main id='homePage'>
				{homeFeed?.map((post, cardIndex) => {
					console.log(homeFeed);
					return (
						<Card key={cardIndex}>
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
								<FavoriteBorderRoundedIcon />
								<div>{post.likes} likes</div>
								<div id='postCaption'>
									{post.caption && (
										<>
											<span>{post.owner[0].username}</span>
											{post.caption}
										</>
									)}
								</div>
								{post.comments.map((comment, commentsIndex) => {
									return (
										<div className='postComment' key={commentsIndex}>
											<span>{comment.owner}</span>
											{comment.comment}
										</div>
									);
								})}

								{new Date(post.inception).toLocaleString('en-US', {
									timeZone: new Intl.DateTimeFormat().resolvedOptions()
										.timeZone,
								})}
							</CardContent>
							<CardActions>
								<CommentInput
									index={cardIndex}
									post={post}
									homeFeed={homeFeed}
									setHomeFeed={setHomeFeed}
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
