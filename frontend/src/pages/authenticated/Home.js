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
	IconButton,
	CircularProgress,
} from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import './design/home.css';

function CommentInput(props) {
	const { post, homeFeed, setHomeFeed, index } = props;
	const [comment, setComment] = useState('');

	const postComment = async (e, postId) => {
		e.preventDefault();
		console.log(index);

		const result = await fetch('/api/post/comment', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ comment, postId }),
		});
		if (result.status === 200) {
			const { data } = await result.json();
			setComment('');
			setHomeFeed((prevState) => {
				prevState[index].comments = [data, ...prevState[index].comments];
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

	const dislikePost = async (id, feedIndex) => {
		const results = await fetch(`/api/post/dislike/?id=${id}`, {
			method: 'PUT',
		});
		if (results.status === 200) {
			const { data } = await results.json();
			setHomeFeed((prevState) => {
				prevState[feedIndex].likes = data.likes;
				return [...prevState];
			});
			return data;
		}
		return;
	};

	const likePost = async (id, feedIndex) => {
		const results = await fetch(`/api/post/like/?id=${id}`, {
			method: 'PUT',
		});
		if (results.status === 200) {
			const { data } = await results.json();
			setHomeFeed((prevState) => {
				prevState[feedIndex].likes = data.likes;
				return [...prevState];
			});
			return data;
		}
		return;
	};
	if (homeFeed.length) {
		return (
			<main id='homePage'>
				{homeFeed?.map((post, cardIndex) => {
					return (
						<Card key={cardIndex}>
							<CardHeader
								avatar={
									<Avatar
										src={
											post?.owner[0].profilePhoto
												? `${process.env.REACT_APP_S3_URL}${post.owner[0].profilePhoto}`
												: null
										}
									/>
								}
								title={post?.owner[0].username}
							/>
							<CardMedia>
								<img
									id='postImage'
									src={
										post?.photo &&
										`${process.env.REACT_APP_S3_URL}${post.photo}`
									}
									alt='post'
								/>
							</CardMedia>
							<CardContent>
								{post?.likes?.includes(loggedInUser.username) ? (
									<IconButton onClick={() => dislikePost(post._id, cardIndex)}>
										<FavoriteRoundedIcon sx={{ color: 'red' }} />
									</IconButton>
								) : (
									<IconButton onClick={() => likePost(post._id, cardIndex)}>
										<FavoriteBorderRoundedIcon />
									</IconButton>
								)}

								<div>{post?.likes.length} likes</div>
								<div>
									{post?.caption && `${post.owner[0].username} ${post.caption}`}
								</div>
								{post?.comments?.map((comment, commentsIndex) => {
									return (
										<div
											key={commentsIndex}
										>{`${comment.owner} ${comment.comment}`}</div>
									);
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
