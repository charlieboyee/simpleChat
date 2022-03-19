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
	CircularProgress,
	IconButton,
	Input,
	Menu,
	MenuItem,
} from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
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
			setComment('');
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

function DeleteCommentMenu(props) {
	const { open, anchorEl, setAnchorEl, postId, commentId, index, setHomeFeed } =
		props;

	const handleClose = () => {
		setAnchorEl(null);
	};
	const deleteComment = async () => {
		const results = await fetch('/api/post/comment', {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ postId, commentId }),
		});
		if (results.status === 200) {
			const { data } = await results.json();
			setAnchorEl(null);
			setHomeFeed((prevState) => {
				data.owner = prevState[index].owner;
				prevState[index] = data;
				return [...prevState];
			});
			return;
		}
	};

	return (
		<Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
			<MenuItem onClick={deleteComment}>Delete</MenuItem>
		</Menu>
	);
}

const likePost = () => {};

export default function Home(props) {
	const { homeFeed, setHomeFeed } = props;

	const [commentId, setCommentId] = useState(null);
	const [postId, setPostId] = useState(null);
	const [cardIndex, setCardIndex] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	let open = Boolean(anchorEl);

	if (homeFeed.length) {
		return (
			<main id='homePage'>
				<DeleteCommentMenu
					open={open}
					anchorEl={anchorEl}
					setAnchorEl={setAnchorEl}
					commentId={commentId}
					postId={postId}
					index={cardIndex}
					setHomeFeed={setHomeFeed}
				/>
				{homeFeed?.map((post, index) => {
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
								<FavoriteBorderRoundedIcon onClick={likePost} />
								<div>{post.likes} likes</div>
								<div id='postCaption'>
									{post.caption && (
										<>
											<span>{post.owner[0].username}</span>
											{post.caption}
										</>
									)}
								</div>
								{post.comments.map((comment, commentsIndex, arr) => {
									return (
										<div className='postComment' key={commentsIndex}>
											<span>{comment.owner}</span>
											<span>{comment.comment}</span>
											<IconButton
												disableRipple
												onClick={(e) => {
													setAnchorEl(e.currentTarget);
													setCommentId(comment._id);
													setPostId(post._id);
													setCardIndex(index);
												}}
												children={<MoreHorizRoundedIcon />}
											/>
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
									index={index}
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
