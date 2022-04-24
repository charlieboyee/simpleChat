const nodemailer = require('nodemailer');

async function sendMail(options, type) {
	let text;
	let subject;
	if (type === 'Account Created') {
		subject = 'Account successfully created.';
		text =
			'Welcome to SimpleChat! Please respect the community guidelines and chat away!';
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
	return result;
}

module.exports = sendMail;
