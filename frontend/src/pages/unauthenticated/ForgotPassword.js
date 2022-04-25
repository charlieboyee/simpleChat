import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Card,
	CardActions,
	CardHeader,
	TextField,
	Button,
	CardContent,
} from '@mui/material';

import './design/forgotPassword.css';

export default function CreateAccount() {
	const navigate = useNavigate();

	const [stage, setStage] = useState(0);
	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');

	const [emailError, setEmailError] = useState(false);
	const [verificationError, setVerificationError] = useState(false);
	const [confirmError, setConfirmError] = useState(false);

	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');

	const handleCodeChange = (e) => {
		setVerificationError(false);
		setCode(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmailError(false);
		setEmail(e.target.value);
	};

	const handleConfirmPassword = (e) => {
		setConfirmError(false);
		setConfirmNewPassword(e.target.value);
	};
	const handleNewPassword = (e) => {
		setConfirmError(false);
		setNewPassword(e.target.value);
	};

	const changePassword = async (e) => {
		e.preventDefault();
		if (newPassword !== confirmNewPassword) {
			setConfirmError(true);
			return;
		}
		const result = await fetch('/api/changePassword', {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ email, newPassword }),
		});

		if (result.status === 200) {
			navigate('/', { replace: true });
			return;
		}

		setConfirmError(true);
		return;
	};

	const verifyCode = async (e) => {
		e.preventDefault();

		const result = await fetch('/api/verifyCode', {
			method: 'PUT',
			body: JSON.stringify({ code, email }),
			headers: { 'content-type': 'application/json' },
		});

		if (result.status === 200) {
			return setStage(2);
		}
		setVerificationError(true);
		return;
	};

	const sendEmail = async (e) => {
		e.preventDefault();
		const result = await fetch('/api/sendVerificationCode', {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ email }),
		});

		if (result.status === 200) {
			return setStage(1);
		}
		if (result.status === 204) {
			setEmailError(true);
			return;
		}
	};

	if (stage === 0) {
		return (
			<main id='forgotPassword'>
				<form onSubmit={sendEmail}>
					<Card>
						<CardHeader title='Forgot Password' />
						<CardContent>
							<p>
								Enter the email associated with the lost password. Check the
								email for a 6 digit code and enter it on the next step.
							</p>
							<TextField
								placeholder='example@email.com'
								type='email'
								helperText={emailError && 'Email not found.'}
								value={email}
								error={emailError}
								onChange={handleEmailChange}
							/>
						</CardContent>
						<CardActions>
							<Button type='submit'>Send Email</Button>
							<Button
								type='button'
								onClick={() => navigate('/', { replace: true })}
							>
								Already have an account? Click here.
							</Button>
						</CardActions>
					</Card>
				</form>
			</main>
		);
	}
	if (stage === 1) {
		return (
			<main id='forgotPassword'>
				<form onSubmit={verifyCode}>
					<Card>
						<CardHeader title='Forgot Password' />
						<CardContent>
							<p>Code expires in 3 minutes.</p>
							<TextField
								helperText={verificationError && 'Please try again.'}
								error={verificationError}
								placeholder='Verification Code'
								onChange={handleCodeChange}
								value={code}
							/>
						</CardContent>
						<CardActions>
							<Button type='submit'>Verify</Button>
							<Button
								type='button'
								onClick={() => navigate('/', { replace: true })}
							>
								Already have an account? Click here.
							</Button>
						</CardActions>
					</Card>
				</form>
			</main>
		);
	}

	if (stage === 2) {
		return (
			<main id='forgotPassword'>
				<form onSubmit={changePassword}>
					<Card>
						<CardHeader title='Forgot Password' />
						<CardContent>
							<TextField
								placeholder='New Password'
								value={newPassword}
								type='password'
								onChange={handleNewPassword}
								required
								error={confirmError}
							/>
							<TextField
								placeholder='Confirm New Password'
								value={confirmNewPassword}
								type='password'
								required
								error={confirmError}
								onChange={handleConfirmPassword}
								helperText={
									confirmError && newPassword !== confirmNewPassword
										? 'Please make sure that both fields match'
										: 'Code expired or network error'
								}
							/>
						</CardContent>
						<CardActions>
							<Button type='submit'>Reset Password</Button>
							<Button
								type='button'
								onClick={() => navigate('/', { replace: true })}
							>
								Already have an account? Click here.
							</Button>
						</CardActions>
					</Card>
				</form>
			</main>
		);
	}
}
