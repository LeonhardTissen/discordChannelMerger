const createdWebhooks = [];

export async function deleteAllWebhooks(channel) {
	const webhooks = await channel.fetchWebhooks();
	
	webhooks.forEach(async webhook => {
		await webhook.delete();
	});

	console.log(`Deleted ${webhooks.size} webhooks in channel ${channel.id}`);
}

export async function createWebhook(name, avatarUrl, channel) {
	// Check if webhook with name and avatarUrl already exists
	const existingWebhook = createdWebhooks.find(webhook => webhook.name === name && webhook.avatarUrl === avatarUrl);
	if (existingWebhook) {
		console.log(`Webhook ${name} already exists in channel ${channel.id}`);
		return existingWebhook;
	}

	// Try to create it
	try {
		const webhook = await channel.createWebhook({
			name,
			avatar: avatarUrl
		});
		createdWebhooks.push({
			name,
			avatarUrl,
			id: webhook.id,
			token: webhook.token
		});
		console.log(`Created webhook ${name} in channel ${channel.id}`);
		return webhook;
	} catch (err) {
		// No more webhooks can be created in this channel
		console.log('Could not create webhook. Trying to edit an existing one instead.')

		// Rename a random existing webhook
		const randomWebhook = createdWebhooks[Math.floor(Math.random() * createdWebhooks.length)];
		await randomWebhook.webhook.edit(name, {
			avatar: avatarUrl
		});
		randomWebhook.name = name;
		randomWebhook.avatarUrl = avatarUrl;
		return randomWebhook.webhook;
	}
}
