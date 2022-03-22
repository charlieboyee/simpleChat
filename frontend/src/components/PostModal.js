import { useState, useEffect } from 'react';
import {
	Modal,
	Card,
	CardHeader,
	CardContent,
	CardMedia,
	CircularProgress,
} from '@mui/material';

import './design/postModal.css';

export default function PostModal({
	postModalOpen,
	setPostModalOpen,
	post,
	setPostToView,
}) {
	const handleClose = () => {
		setPostToView(null);
		setPostModalOpen(false);
	};

	useEffect(() => {
		if (postModalOpen) {
			fetch(`/api/post/?id=${post}`)
				.then((res) => {
					if (res.status === 200) {
						return res.json();
					}
				})
				.then((result) => {
					setPostToView(result.post);
				});
		}
	}, [postModalOpen]);

	return (
		<Modal id='postModal' open={postModalOpen} onClose={handleClose}>
			<Card>
				<CardMedia>
					{post?.photo ? (
						<img
							alt='postImg'
							src={`${process.env.REACT_APP_S3_URL}${post.photo}`}
						/>
					) : null}
				</CardMedia>
				<CardContent>
					<div>Profilephoto</div>
					<div>comments</div>
					<div>like button</div>
					<div>Comment</div>
				</CardContent>
			</Card>
		</Modal>
	);
}
