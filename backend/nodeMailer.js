const nodemailer = require('nodemailer');

async function sendMail(options, type) {
	let text;
	let subject;
	let code;
	switch (type) {
		case 'Account Created':
			subject = 'Account successfully created.';
			text =
				'Welcome to SimpleChat! Please respect the community guidelines and chat away!';
			break;
		case 'Code':
			code = Math.floor(Math.random() * 900000) + 100000;
			text = `This is your code ${code}`;
			subject = 'Password reset code.';
			break;
		default:
			console.log('No email type');
	}

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.MAILER_EMAIL,
			pass: process.env.MAILER_PASS,
		},
	});

	const mailOptions = {
		from: process.env.MAILER_EMAIL,
		to: options.email,
		subject,
		text,
	};

	const result = await transporter.sendMail(mailOptions);
	return code;
}

module.exports = sendMail;
