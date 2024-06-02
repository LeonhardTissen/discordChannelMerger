# discordChannelMerger

A simple bot that merges multiple channels into one.
The bot launches and does 2 things

- Collect all messages from the specified channels
- Post them in the specified channel

This includes all messages with attachments and if they are pinned or not.

## Installation

1. Clone the repository

```bash
git clone https://github.com/LeonhardTissen/discordChannelMerger.git
cd discordChannelMerger
```

2. Install the required packages

```bash
yarn
```

3. Create a `.env` file in the root directory and add the following content

```
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
```

4. Edit the `settings.json` file by putting in collection channels and a target channel

5. Start the bot

```bash
yarn start
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

<p align="center">
	<img src="https://s.warze.org/paddingleft3.png" style="display: inline-block;"><a href="https://twitter.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/x3.png" alt="Leonhard Tissen on X/Twitter" style="display: inline-block;"/></a><a href="https://youtube.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/youtube3.png" alt="Leonhard Tissen on YouTube" style="display: inline-block;"/></a><a href="https://linkedin.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/linkedin3.png" alt="Leonhard Tissen on LinkedIn" style="display: inline-block;"/></a><a href="https://github.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/github3.png" alt="Leonhard Tissen on GitHub" style="display: inline-block;"/></a><a href="https://gitlab.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/gitlab3.png" alt="Leonhard Tissen on GitLab" style="display: inline-block;"/></a><img src="https://s.warze.org/paddingright2.png">
</p>
