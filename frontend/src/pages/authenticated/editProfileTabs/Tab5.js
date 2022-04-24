import { Button } from '@mui/material';
export default function Tab5() {
	return (
		<>
			<section>
				<header>Manage Contacts</header>
			</section>
			<div>
				<p>
					The people listed here are contacts you've uploaded to Instagram. To
					remove your synced contacts, tap Delete All. Your contacts will be
					re-uploaded the next time Instagram syncs your contacts unless you go
					to your device settings and turn off access to contacts.
				</p>
				<p>
					Only you can see your contacts, but Instagram uses the info you've
					uploaded about your contacts to make friend suggestions for you and
					others and to provide a better experience for everyone.
				</p>
				<div>
					<span style={{ fontWeight: 'bold', verticalAlign: 'middle' }}>
						0 Synced Contacts
					</span>
					<Button
						sx={{ float: 'right', padding: '0' }}
						variant='string'
						disabled
					>
						Delete All
					</Button>
				</div>
				<p>When you upload your contacts to Instagram, you'll see them here.</p>
			</div>
		</>
	);
}
