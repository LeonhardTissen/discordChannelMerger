function getMessageInfo(message) {
	const infoObject = {
		date: message.createdAt,
		content: message.content,
		author: {
			username: message.author.displayName,
			id: message.author.id,
			avatar: message.author.displayAvatarURL()
		}
	}
	if (message.attachments.size > 0) {
		infoObject.attachments = message.attachments.map(attachment => attachment.url);
	}
	if (message.pinned) {
		infoObject.pinned = true;
	}
	if (message.reactions.size > 0) {
		infoObject.reactions = message.reactions.cache.map(reaction => reaction.emoji.name);
	}
	return infoObject;
}

export async function fetchMessages(channel) {
	let lastID = null;
	let messages = [];

	while (true) {
		const fetchedMessages = await channel.messages.fetch({
			limit: 100,
			...(lastID && { before: lastID })
		})

		if (fetchedMessages.size === 0) {
			return messages.reverse().map(getMessageInfo);
		}

		messages = messages.concat(Array.from(fetchedMessages.values()));
		lastID = fetchedMessages.lastKey();
	}
}
