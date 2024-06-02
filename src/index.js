import dotenv from 'dotenv';
import { Client, WebhookClient } from 'discord.js';
import { fetchMessages } from './collector.js';
import { createWebhook, deleteAllWebhooks } from './webhook.js';
import fs from 'fs';

const settings = JSON.parse(fs.readFileSync('settings.json'));

dotenv.config();

const { DISCORD_TOKEN } = process.env;

if (!DISCORD_TOKEN) {
	throw new Error('DISCORD_TOKEN is not defined');
}

const client = new Client({
	intents: ['GuildMembers', 'Guilds', 'GuildMessages', 'GuildMessageReactions']
});

client.once('ready', async () => {
	console.log('Ready!');
	
	let allMessages = [];
	const collectionChannelIds = settings.collect;
	const targetChannelId = settings.target;

	if (!collectionChannelIds || !targetChannelId) {
		throw new Error('collect and target must be defined in settings.json');
	}

	for (const channelId of collectionChannelIds) {
		const channel = await client.channels.fetch(channelId);
		const messages = await fetchMessages(channel);
		allMessages.push(...messages);
	};
	
	allMessages.sort((a, b) => a.date - b.date);
	
	const targetChannel = await client.channels.fetch(targetChannelId);

	console.log(allMessages);
	
	await deleteAllWebhooks(targetChannel);

	for (const message of allMessages) {
		if (message.content === '' && !message.attachments) continue;

		const webhook = await createWebhook(message.author.username, message.author.avatar, targetChannel);
		const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });
		try {
			await webhookClient.send({
				content: message.content,
				username: message.author.username,
				avatarURL: message.author.avatar,
				files: message.attachments
			});
			if (message.pinned) {
				const sentMessage = (await targetChannel.messages.fetch({ limit: 1 })).first();
				try {
					await sentMessage.pin();
				} catch (err) {
					console.log('Could not pin message');
				}
			}
		} catch (err) {
			console.log('Could not send message');
		}
	}

	process.exit();
});

client.login(DISCORD_TOKEN);
