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
	Input,
	IconButton,
	Menu,
	MenuItem,
} from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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
			body: JSON.stringify({
				comment,
				postId,
				recipient: post.owner[0].username,
			}),
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

const DeleteMenu = ({
	anchorEl,
	setAnchorEl,
	homeFeed,
	setHomeFeed,
	open,
	postIndex,
	commentInDex,
}) => {
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const deletePost = async () => {
		const results = await fetch(`/api/post/?id=${homeFeed[postIndex]._id}`, {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json',
			},
		});
		if (results.status === 200) {
			setAnchorEl(null);
			setHomeFeed((prevState) => {
				const newState = prevState.filter((post) => {
					if (post._id !== prevState[postIndex]._id) {
						return post;
					}
				});
				return [...newState];
			});
		}

		return;
	};
	const deleteComment = async () => {
		const results = await fetch('/api/post/comment', {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ commentId: commentInDex.commentId }),
		});
		if (results.status === 200) {
			setAnchorEl(null);
			setHomeFeed((prevState) => {
				const newState = prevState[postIndex].comments.filter((comment) => {
					if (comment._id !== commentInDex.commentId) {
						return comment;
					}
				});
				prevState[postIndex].comments = newState;
				return [...prevState];
			});
		}
		return;
	};

	return (
		<Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
			{anchorEl?.className.includes('commentDelete') ? (
				<MenuItem onClose={handleMenuClose} onClick={deleteComment}>
					Delete
				</MenuItem>
			) : (
				<MenuItem onClose={handleMenuClose} onClick={deletePost}>
					Delete
				</MenuItem>
			)}
		</Menu>
	);
};

export default function Home(props) {
	const { homeFeed, setHomeFeed } = props;
	const { userData } = useOutletContext();
	const [loggedInUser] = userData;

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [commentInDex, setCommentInDex] = useState('');
	const [postIndex, setPostIndex] = useState(null);

	const handleMenuOpen = (e, pIndex, commentId = '', commentIndex = '') => {
		setPostIndex(pIndex);
		setCommentInDex({ commentId, commentIndex });
		setAnchorEl(e.currentTarget);
	};

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
								action={
									post?.owner[0].username === loggedInUser.username ? (
										<IconButton
											onClick={(e) =>
												handleMenuOpen(
													e,

													cardIndex
												)
											}
										>
											<MoreVertIcon />
										</IconButton>
									) : null
								}
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

								<div>{post.likes && post.likes.length} likes</div>
								<div>
									{post?.caption && `${post.owner[0].username} ${post.caption}`}
								</div>
								{post?.comments?.map((comment, commentIndex) => {
									return (
										<div className='comment' key={commentIndex}>
											{comment.owner === loggedInUser.username ? (
												<IconButton
													className='commentDelete'
													onClick={(e) =>
														handleMenuOpen(
															e,
															cardIndex,
															comment._id,
															commentIndex
														)
													}
												>
													<MoreHorizIcon />
												</IconButton>
											) : null}

											{`${comment.owner} ${comment.comment}`}
										</div>
									);
								})}
								<div>
									{new Date(post.inception).toLocaleString({
										timeZone: new Intl.DateTimeFormat().resolvedOptions()
											.timeZone,
									})}
								</div>
							</CardContent>

							<CardActions>
								<CommentInput
									index={cardIndex}
									post={post}
									homeFeed={homeFeed}
									setHomeFeed={setHomeFeed}
								/>
							</CardActions>

							<DeleteMenu
								anchorEl={anchorEl}
								setAnchorEl={setAnchorEl}
								homeFeed={homeFeed}
								setHomeFeed={setHomeFeed}
								open={open}
								postIndex={postIndex}
								commentInDex={commentInDex}
							/>
						</Card>
					);
				})}
			</main>
		);
	}
	return <h1>Nothing to display yet</h1>;
}
