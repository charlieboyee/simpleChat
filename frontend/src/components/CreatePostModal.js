import { useState } from 'react';
import { Card, CardContent, CardHeader, Modal, Button } from '@mui/material';
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded';
import './design/createPostModal.css';
export default function CreatePostModal(props) {
	const { modalOpen, setModalOpen } = props;

	const handleClose = () => {
		setModalOpen(false);
	};
	return (
		<Modal id='createPostModal' onClose={handleClose} open={modalOpen}>
			<Card>
				<CardHeader title='Create New Post' />
				<CardContent>
					<PhotoLibraryRoundedIcon sx={{ fontSize: 60 }} />
					<div>
						<h3>Drag and drop photos here</h3>
						<Button variant='contained'>Select from computer</Button>
					</div>
				</CardContent>
			</Card>
		</Modal>
	);
}
