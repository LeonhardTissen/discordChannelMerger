import dotenv from 'dotenv';
import { Client, WebhookClient } from 'discord.js';
import { fetchMessages } from './collector.js';
import { createWebhook, deleteAllWebhooks } from './webhook.js';

dotenv.config();

const { DISCORD_TOKEN } = process.env;

if (!DISCORD_TOKEN) {
	throw new Error('DISCORD_TOKEN is not defined');
}

const client = new Client({
	intents: ['GuildMembers', 'Guilds', 'GuildMessages', 'GuildMessageReactions', 'GuildMessageTyping']
});

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

client.once('ready', async () => {
	console.log('Ready!');
	
	let allMessages = [];
	const collectionChannelIds = [
		'1191765582895403029', // #pablo-highlights
		'1212786067585896478', // #mm
		'1228376897944031272', // #blue-art-galore-or-something
		'1234185418816094308', // #weigh-me-downs
		'1238505351934902384', // #the-zoy-hub
		'1238680411400310874', // #channel-name
		'1241022514495488020', // #kanna-daily-art	
	];
	const targetChannelId = '1246753254872977499';

	for (const channelId of collectionChannelIds) {
		const channel = await client.channels.fetch(channelId);
		const messages = await fetchMessages(channel);
		allMessages.push(...messages);
	};
	
	allMessages.sort((a, b) => a.date - b.date);
	
	const targetChannel = await client.channels.fetch(targetChannelId);
	
	await deleteAllWebhooks(targetChannel);

	// console.log(allMessages);

	for (const message of allMessages) {
		if (message.content === '' && !message.attachments) {
			continue;
		}

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

	console.log('Done!');
	process.exit();

});

client.login(DISCORD_TOKEN);
