---
title: Your data and safety
description: Where your bots are stored, how your secrets are protected and what to back up.
---

DisFlow is local-first: your bots live in the browser on the device you use, not in an online
account.

## Where your bots are stored

Bots, graphs, commands, enabled events, tokens and variables are saved in your browser's storage
for the DisFlow site.

This means:

- Your bots appear only in the browser and on the device where you created them.
- They do not sync to another computer, phone or browser.
- A different browser profile has its own separate list of bots.
- Bots created in a private/incognito window disappear when that window closes.
- Clearing this site's data removes your bots from DisFlow.

:::tip[Stick to one browser]
Use the same browser and device for DisFlow. If you switch, your bots will appear to be missing
because the new browser has its own storage.
:::

## What is protected

- Your **bot token** is encrypted before it is saved.
- **Environment variables** are encrypted before they are saved.
- Values stay locked until you enter your 6-digit passcode.

Everything else — graphs, commands and bot names — is stored locally but is not encrypted.

## Backups

Exporting your bot downloads **code**, not a copy of your editable graphs. There is currently no
import feature that restores a project into DisFlow.

To protect your work:

- Export your bot whenever you reach a good state, so you always have a runnable copy.
- Keep the exported ZIP somewhere safe.
- Keep the `db.json` file if your bot uses **Database** blocks and the data matters.
- Make notes about which events and commands you built, especially for large projects.

## Your passcode

- It protects the saved token and environment variables.
- It **cannot be reset or recovered**.
- Without it, the encrypted values cannot be unlocked. The rest of the project is still readable,
  but the token and secrets are lost.
- On a shared computer, select **Lock** on the **Variables** page when you finish.

Export your `.env` file and keep it somewhere safe if you need a long-term copy of your secrets.

## Your bot token

Treat the token like the password to your bot:

- Never post it in Discord, a screenshot, a support issue or a public repository.
- Never commit your `.env` file to Git.
- Add it to your host's environment variables, not to the uploaded files.
- If it is exposed, reset it immediately in the Discord Developer Portal, then update the token in
  your bot's `.env` file and restart the bot.

## Sharing and deleting

- DisFlow has no built-in way to share a project with someone else.
- If you share an exported bot, it does not contain your token, but it may contain server IDs and
  channel names from your graphs. Review the files before sharing.
- To remove all DisFlow data from a device, clear the site data for DisFlow in your browser's
  settings. This cannot be undone.

## Related pages

- [Environment variables](/guides/environment-variables/)
- [Permissions and safety](/help/permissions/)
- [Troubleshooting](/help/troubleshooting/)
