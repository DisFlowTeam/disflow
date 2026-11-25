---
title: Environment variables
description: Keep private keys for your bot and export them safely.
---

The **Variables** page stores secrets your bot may need, such as API keys for other services.
Values are encrypted and kept in your browser.

## Add a variable

1. Open **Variables**.
2. Select **New variable**.
3. Enter a name and value.
4. Save.

Names use capital letters, numbers and underscores, and start with a letter or underscore. For
example:

```text
WEBSITE_API_KEY
MUSIC_SERVICE_TOKEN
```

## Unlock and lock

The page starts locked. Select **Unlock** and enter your 6-digit passcode to view or export values.

Select **Lock** when you are done, especially on a shared computer. Locking removes the key from
memory until you unlock again.

:::danger[Your passcode cannot be reset]
It protects your bot token and every stored value. DisFlow cannot recover them if you forget it.
Write it down and keep it somewhere safe.
:::

## Export a `.env` file

Select **Export .env** while unlocked. DisFlow downloads a file containing your variables as
`NAME=value` lines.

You can put this file next to an exported bot. Combine it with the token:

```dotenv
DISCORD_TOKEN=your-bot-token
WEBSITE_API_KEY=abc123
```

:::caution[Keep the file private]
The exported `.env` contains your secrets in plain text. Never upload it, commit it or share it in a
chat. If a key is exposed, revoke it in the service that issued it and create a new one.
:::

## Your bot token

Your bot token is encrypted as soon as you add the bot. DisFlow does not write it into the files you
export. You add it to the `.env` file yourself when setting up the bot — see
[Exporting your bot](/guides/exporting/#run-your-bot).

## Related pages

- [Your data and safety](/help/your-data/)
- [Permissions and safety](/help/permissions/)
- [Exporting your bot](/guides/exporting/)
