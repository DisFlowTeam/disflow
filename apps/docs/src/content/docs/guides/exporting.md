---
title: Exporting your bot
description: Download your bot, start it and keep it online.
---

When your bot is ready, export it as a ZIP file and run it. Everything you built is turned into a
self-contained bot project.

## Before you export

- **Save every graph.** Export uses the last saved version of each graph.
- **Turn on at least one event or command.** A bot with only a main file has nothing to respond to.
- **Check each event is switched on.** Events you turned off are left out.

Select **Export bot** on the overview, events or commands page. The ZIP is named after your bot.

## What's in the ZIP

| File | What it is |
| --- | --- |
| `index.js` | The bot's starting point |
| `events/` | One file per event you turned on |
| `commands/` | One file per slash command you created |
| `package.json` | The list of things the bot needs to run |
| `.env.example` | A template for your bot token |
| `README.md` | A short reminder of these steps |

## Run your bot

You need **Node.js 18 or newer** installed on the computer or server that will run the bot.

1. Unzip the file.
2. Open a terminal in the unzipped folder.
3. Install the bot's dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env`.
5. Open `.env` and add your bot token:

   ```dotenv
   DISCORD_TOKEN=your-bot-token
   ```

6. Start the bot:

   ```bash
   npm start
   ```

The bot is online as long as that command is running.

:::tip[Only one copy at a time]
Run each bot token in one place only. Starting the same token twice can make the bot disconnect.
:::

## Keeping your bot online

If you close the terminal, the bot stops. For a bot that stays online all the time, see
[Keeping your bot online](/guides/hosting/).

## Making changes

Your exported bot does not update itself. To change your bot:

1. Edit and save the graph in DisFlow.
2. Export a new ZIP.
3. Replace the files on your host and start the bot again.

## Related pages

- [Keeping your bot online](/guides/hosting/)
- [Troubleshooting](/help/troubleshooting/)
- [Environment variables](/guides/environment-variables/)
- [Events](/guides/events/)
- [Slash commands](/guides/slash-commands/)
