import { Checkbox } from '@mui/material';
export default function Tab3() {
	return (
		<>
			<section>
				<header>Subscribe to:</header>
			</section>
			<label>
				<Checkbox disabled defaultChecked />
				Feedback Emails
			</label>
			<div>Give feedback on Instagram.</div>
			<label>
				<Checkbox disabled defaultChecked />
				Reminder emails
			</label>
			<div>Get notifications you may have missed.</div>
			<label>
				<Checkbox disabled defaultChecked />
				Product emails
			</label>
			<div>Get tips about Instagram's tools.</div>
			<label>
				<Checkbox disabled defaultChecked />
				News emails
			</label>
			<div>Learn about new Instagram features.</div>
		</>
	);
}
