import { useState, useEffect } from 'react';
import {
	Avatar,
	Modal,
	Button,
	Card,
	CardHeader,
	CardContent,
	CardMedia,
	IconButton,
	Input,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	CircularProgress,
} from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

import './design/postModal.css';

function CommentInput(props) {
	const { post, setPostToView, loggedInUser } = props;

	const [comment, setComment] = useState('');

	const postComment = async (e) => {
		e.preventDefault();

		const result = await fetch('/api/post/comment', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				comment,
				postId: post._id._id,
				recipient: post._id.owner,
			}),
		});
		if (result.status === 200) {
			const { data } = await result.json();
			setPostToView((prevState) => {
				data.owner = [
					{
						owner: loggedInUser.username,
						profilePhoto: loggedInUser.profilePhoto,
					},
				];
				prevState.postComments.push(data);
				return { ...prevState };
			});
			setComment('');

			return;
		}
		return;
	};

	return (
		<form onSubmit={(e) => postComment(e, post._id.id)}>
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

export default function PostModal({
	postModalOpen,
	setPostModalOpen,
	post,
	setPostToView,
	loggedInUser,
	notiId,
}) {
	const controller = new AbortController();
	const signal = controller.signal;
	const handleClose = () => {
		setPostToView(null);
		setPostModalOpen(false);
	};

	const [loading, setLoading] = useState(true);

	const [postNotFound, setPostNotFound] = useState(false);

	const likePost = async (id) => {
		const results = await fetch(`/api/post/like/?id=${id}`, {
			method: 'PUT',
		});
		if (results.status === 200) {
			const { data } = await results.json();

			setPostToView((prevState) => {
				prevState._id.likes = data.likes;
				return { ...prevState };
			});
		}
		return;
	};

	const dislikePost = async (id) => {
		const results = await fetch(`/api/post/dislike/?id=${id}`, {
			method: 'PUT',
		});
		if (results.status === 200) {
			const { data } = await results.json();
			setPostToView((prevState) => {
				prevState._id.likes = data.likes;
				return { ...prevState };
			});
		}
		return;
	};

	useEffect(() => {
		if (postModalOpen) {
			(async () => {
				const results = await fetch(
					`/api/post/?postId=${post}&notiId=${notiId}`,
					{
						signal,
					}
				);
				if (results.status === 200) {
					const data = await results.json();
					setPostToView(data[0]);
					setLoading(false);
				}
				if (results.status === 204) {
					setPostNotFound(true);
					setLoading(false);
				}
			})();
		}
		return () => {
			controller.abort();
		};
	}, [postModalOpen]);

	if (loading) {
		return (
			<Modal id='postModal' open={postModalOpen} onClose={handleClose}>
				<CircularProgress />
			</Modal>
		);
	}
	if (!loading && postNotFound) {
		return (
			<Modal id='postModal' open={postModalOpen} onClose={handleClose}>
				<h1>Post Not Found</h1>
			</Modal>
		);
	}
	if (!loading) {
		return (
			<Modal id='postModal' open={postModalOpen} onClose={handleClose}>
				<Card>
					{post?._id?.photo ? (
						<img
							alt='postImg'
							src={`${process.env.REACT_APP_S3_URL}${post?._id?.photo}`}
						/>
					) : null}
					<CardContent>
						<div>
							<Avatar
								src={
									loggedInUser.profilePhoto &&
									`${process.env.REACT_APP_S3_URL}${loggedInUser.profilePhoto}`
								}
							/>
							{loggedInUser.username}
						</div>
						<List>
							{post?.postComments?.map((comment, index) => {
								return (
									<ListItem key={index}>
										<ListItemAvatar>
											<Avatar
												src={
													comment.owner[0].profilePhoto
														? `${process.env.REACT_APP_S3_URL}${comment.owner[0].profilePhoto}`
														: null
												}
											/>
										</ListItemAvatar>

										<div>
											<span>{comment.owner.username}</span>
											<span>{comment.comment}</span>
										</div>
									</ListItem>
								);
							})}
						</List>
						<div>
							{post?._id?.likes?.includes(loggedInUser.username) ? (
								<IconButton
									disableRipple
									onClick={() => dislikePost(post._id._id)}
								>
									<FavoriteRoundedIcon sx={{ color: 'red' }} />
								</IconButton>
							) : (
								<IconButton
									disableRipple
									onClick={() => likePost(post._id._id)}
								>
									<FavoriteBorderRoundedIcon />
								</IconButton>
							)}
							<CommentInput
								post={post}
								setPostToView={setPostToView}
								loggedInUser={loggedInUser}
							/>
						</div>
					</CardContent>
				</Card>
			</Modal>
		);
	}
}
