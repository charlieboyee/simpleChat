import { useEffect, useState, useCallback } from 'react';
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

	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		console.log(croppedArea, croppedAreaPixels);
	}, []);

	const toStageZero = () => {
		setImage(null);
		setStage(0);
	};

	const handleClose = () => {
		setModalOpen(false);
	};

	const handleFileChange = (e) => {
		const reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);

		reader.onload = (evt) => {
			setImage(reader.result);
		};
	};

	useEffect(() => {
		if (image) {
			setStage(1);
		}
	}, [image]);
	if (stage === 0) {
		return (
			<Modal className='createPostModal' onClose={handleClose} open={modalOpen}>
				<Card id='choosePhotoCard'>
					<CardHeader title='Create New Post' />
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
			<Modal className='createPostModal' onClose={handleClose} open={modalOpen}>
				<Card id='cropPhotoCard'>
					<CardHeader
						title='Crop'
						avatar={
							<IconButton onClick={toStageZero}>
								<ArrowBackRoundedIcon />
							</IconButton>
						}
						action={<Button>Next</Button>}
					/>
					<CardMedia>
						<Cropper
							image={image}
							crop={crop}
							zoom={zoom}
							aspect={1 / 1}
							onCropChange={setCrop}
							onCropComplete={onCropComplete}
							onZoomChange={setZoom}
							objectFit='vertical-cover'
						/>
					</CardMedia>
				</Card>
			</Modal>
		);
	}
}
