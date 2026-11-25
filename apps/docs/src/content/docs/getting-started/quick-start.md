---
title: Create your first bot
description: Go from an empty workspace to a running Discord bot.
---

This guide walks you through your first DisFlow bot. It takes about ten minutes.

## Before you begin

You will need:

- A Discord account and a server where you can add bots.
- The **DisFlow editor** open in your browser. If it is not running yet, see
  [Self-hosting](/self-hosting/).
- Node.js 18+ **only if** you plan to run the exported bot on your own computer.

## 1. Prepare your Discord bot

1. Open the [Discord Developer Portal](https://discord.com/developers/applications).
2. Create a new application.
3. Go to **Bot** and copy the token. Keep it private — Discord only shows it once.
4. Still under **Bot**, enable the settings your bot will need:

   - **Message Content** — to read what people type.
   - **Server Members** — to see members join, leave or update.
   - **Presence** — to see online status.

5. Invite your bot to your server with the `bot` and `applications.commands` permissions.

## 2. Add the bot to DisFlow

1. Open the DisFlow bot list.
2. Select **New bot**.
3. Paste your bot token and give the project a short description.
4. Select **Create**. DisFlow checks the token with Discord.
5. Confirm that the bot shown is yours.
6. Choose a **6-digit passcode**.

:::danger[Keep your passcode somewhere safe]
Your passcode protects the bot token and any secrets you store in DisFlow. It cannot be reset, and
without it your saved secrets cannot be unlocked.
:::

## 3. Give your bot something to do

You can start in the **Main file**, which runs once when the bot starts up. Or jump straight to an
event — a moment your bot reacts to.

### Example: reply to a message

1. Open **Events**.
2. Turn on **Message**.
3. Open its editor.
4. Add **Reply To Message**.
5. Connect **Event Value** (`message`) to the block's **Message** input.
6. Type `Hello!` into the **Content** field.
7. Select **Save**.

Now your bot replies to every message it can read. You can use **If** and **Text Includes** to reply
only when a message contains a particular word.

## 4. Add a slash command

1. Open **Commands** and select **Create command**.
2. Name it `ping` and give it a short description, such as “Check that the bot is online”.
3. Open the command editor.
4. Add **Reply To Interaction** and connect it to the command's start block.
5. Set the reply text to `Pong!`.
6. Select **Save**.

## 5. Save everything, then export

Save each graph you edited. Then select **Export bot** on the overview, events or commands page.

You will get a ZIP file. Unzip it, then follow the steps in
[Exporting your bot](/guides/exporting/#run-your-bot). To keep the bot online all the time, see
[Keeping your bot online](/guides/hosting/).

## What next?

- [Learn the editor](/guides/editor/)
- [Understand how blocks connect](/guides/flows/)
- [Browse all blocks](/reference/node-catalog/)
- [Troubleshooting](/help/troubleshooting/)
- [Glossary](/help/glossary/)
