import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import {
	Avatar,
	Card,
	CardContent,
	CardMedia,
	CardHeader,
	Input,
	IconButton,
	Modal,
	TextField,
	Button,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded';
import './design/createPostModal.css';

export default function CreatePostModal(props) {
	const { modalOpen, setModalOpen, userData } = props;

	const [caption, setCaption] = useState('');
	const [stage, setStage] = useState(0);
	const [image, setImage] = useState(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [cropArea, setCropArea] = useState(null);
	const [croppedImg, setCroppedImg] = useState(null);

	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		setCropArea(croppedAreaPixels);
	}, []);

	const createPost = async (e) => {
		const results = await fetch('/api/post/', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ croppedImg, caption }),
		});
	};

	const toStageZero = () => {
		setImage(null);
		setCroppedImg(null);
		setStage(0);
	};

	const handleClose = () => {
		setModalOpen(false);
		setStage(0);
	};

	const handleFileChange = (e) => {
		const reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);

		reader.onload = (evt) => {
			setImage(reader.result);
		};
	};

	const showCroppedImg = () => {
		const img = new Image();
		img.src = image;

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = cropArea.width;
		canvas.height = cropArea.height;
		ctx.drawImage(
			img,
			cropArea.x,
			cropArea.y,
			cropArea.width,
			cropArea.height,
			0,
			0,
			cropArea.width,
			cropArea.height
		);
		canvas.toBlob((file) => {
			if (file) {
				const imgUrl = URL.createObjectURL(file);
				return setCroppedImg(imgUrl);
			}
		}, 'image/jpg');
	};
	useEffect(() => {
		if (image) {
			setStage(1);
		}
	}, [image]);

	// useEffect(() => {
	// 	if (croppedImg) {
	// 		setStage(2);
	// 	}
	// }, [croppedImg]);

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
				<Card croppedImg={croppedImg ? 'true' : 'false'} id='cropPhotoCard'>
					<CardHeader
						title='Crop'
						avatar={
							<IconButton onClick={toStageZero}>
								<ArrowBackRoundedIcon />
							</IconButton>
						}
						action={
							croppedImg ? (
								<Button onClick={createPost}>Share</Button>
							) : (
								<Button onClick={showCroppedImg}>Next</Button>
							)
						}
					/>

					{croppedImg ? (
						<CardMedia>
							<img src={croppedImg} id='croppedImg' alt='croppedImg' />
							<CardContent>
								<section>
									<Avatar
										src={`${process.env.REACT_APP_S3_URL}${userData.profilePhoto}`}
									/>
									<span>{userData.username}</span>
								</section>

								<textarea
									placeholder='caption'
									value={caption}
									onChange={(e) => setCaption(e.target.value)}
								/>
							</CardContent>
						</CardMedia>
					) : (
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
					)}
				</Card>
			</Modal>
		);
	}
}
