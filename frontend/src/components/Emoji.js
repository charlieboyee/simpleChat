import { useState } from 'react';

import { IconButton, Menu } from '@mui/material';

import emojis from 'emojis-list';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function EmojiList({
	setAnchorEl,
	anchorEl,
	message,
	setMessage,
}) {
	const [emojiList, setEmojiList] = useState(Array.from({ length: 300 }));
	const [hasMore, setHasMore] = useState(true);

	const open = Boolean(anchorEl);

	const closeMenu = () => {
		setAnchorEl(null);
	};

	const fetchNext = () => {
		if (emojiList.length >= emojis.length) {
			setHasMore(false);
			return;
		}

		setEmojiList((prevState) => {
			const newArr = prevState.concat(Array.from({ length: 500 }));
			if (newArr.length > emojis.length) {
				return emojis;
			}
			return newArr;
		});
	};

	return (
		<Menu
			sx={{ width: 900 }}
			anchorEl={anchorEl}
			open={open}
			onClose={closeMenu}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
		>
			<div id='scrollableTarget'>
				<InfiniteScroll
					dataLength={emojiList.length}
					hasMore={hasMore}
					next={fetchNext}
					loader={<h4>Loading...</h4>}
					endMessage={<p style={{ textAlign: 'center' }}>No more emojis.</p>}
					scrollableTarget='scrollableTarget'
				>
					{emojiList.map((emoji, emojiIndex) => {
						return (
							<IconButton
								disableRipple
								onClick={(e) => {
									const newMessage = message.concat(e.target.innerText);
									setMessage(newMessage);
									closeMenu();
								}}
								key={emojiIndex}
							>
								{emojis[emojiIndex]}
							</IconButton>
						);
					})}
				</InfiniteScroll>
			</div>
		</Menu>
	);
}
