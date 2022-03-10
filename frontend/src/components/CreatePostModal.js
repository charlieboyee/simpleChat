import { useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import {
	Card,
	CardContent,
	CardMedia,
	CardHeader,
	Input,
	IconButton,
	Modal,
	Button,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded';
import './design/createPostModal.css';
export default function CreatePostModal(props) {
	const { modalOpen, setModalOpen } = props;

	const [image, setImage] = useState(null);
	const [stage, setStage] = useState(0);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);

	const handleClose = () => {
		setModalOpen(false);
	};

	const handleFileChange = (e) => {
		setImage(e.target.files[0]);
	};

	useEffect(() => {
		if (image) {
			setStage(1);
		}
	}, [image]);
	if (stage === 0) {
		return (
			<Modal id='createPostModal' onClose={handleClose} open={modalOpen}>
				<Card>
					<CardHeader fullWidth title='Create New Post' />
					<CardMedia>
						<PhotoLibraryRoundedIcon />
					</CardMedia>
					<CardContent>
						<h3>Drag and drop photos here</h3>
						<Input
							type='file'
							accept='image/*'
							id='dragDropButton'
							onChange={handleFileChange}
						/>
						<Button
							htmlFor='dragDropButton'
							component='label'
							variant='contained'
						>
							Select from computer
						</Button>
					</CardContent>
				</Card>
			</Modal>
		);
	}

	if (stage === 1) {
		return (
			<Modal id='createPostModal' onClose={handleClose} open={modalOpen}>
				<Card>
					<CardHeader
						fullWidth
						title='Crop'
						avatar={
							<IconButton>
								<ArrowBackRoundedIcon />
							</IconButton>
						}
						action={<Button>Next</Button>}
					/>
					<CardMedia>
						<Cropper image={image} crop={crop} zoom={zoom} aspect={1 / 1} />
					</CardMedia>
				</Card>
			</Modal>
		);
	}
}
