---
title: Glossary
description: Plain-language explanations of the words used in DisFlow and Discord.
---

New to Discord bots? Here are the terms you will see in the editor and the guides.

## DisFlow terms

| Term | Meaning |
| --- | --- |
| **Bot project** | One bot saved in DisFlow, with its own graphs, commands and variables |
| **Workspace** | The list of your bot projects |
| **Graph** | The canvas and blocks that describe one part of your bot's behaviour |
| **Block** | A card on the canvas. Some blocks perform actions; others provide values |
| **Start block** | The first block in a graph: **On Start**, an event block or **On Command** |
| **Connection** | A link between blocks that either controls what runs next or passes a value |
| **Main file** | The graph that runs once when the bot starts |
| **Event editor** | The graph for one event, such as a message being sent |
| **Command editor** | The graph for one slash command |
| **Event Value** | A block that exposes information from the event, such as the member or message |
| **Get Property** | A block that reads one detail from an object, such as `author.username` |
| **Passcode** | The 6-digit code that protects your saved token and secrets |
| **Environment variable** | A named secret value, such as an API key, stored for your bot |
| **Export** | Downloading your bot as a ZIP file that can be run |

## Discord terms

| Term | Meaning |
| --- | --- |
| **Server** | A Discord community. Developers also call it a “guild” |
| **Channel** | A place for messages, voice or threads inside a server |
| **Thread** | A smaller conversation attached to a channel |
| **Member** | A user who is in a particular server, with roles and a nickname |
| **User** | A Discord account, whether or not they are in your server |
| **Role** | A label that groups members and grants permissions |
| **Permissions** | The actions a member or bot is allowed to perform |
| **Role hierarchy** | The order of roles. A bot can only manage roles below its own highest role |
| **Nickname** | The name a member uses in one server, separate from their username |
| **Token** | The secret password that lets your bot log in to Discord |
| **Intent** | A category of information Discord sends to your bot |
| **Privileged intent** | An intent that must be switched on in the Developer Portal, such as Message Content |
| **Slash command** | A command typed with `/`, such as `/ping` |
| **Option** | Extra information given to a command, such as a user or reason |
| **Subcommand** | A named branch of a command, such as `/config set` |
| **Interaction** | Any time a member interacts with your bot: a command, button, menu or form |
| **Component** | A button, select menu or other interactive element attached to a message |
| **Embed** | A formatted message card with a title, description, fields and colour |
| **DM** | A direct message between users, outside a server |
| **Mention** | A clickable reference to a user, role or channel, written with `@` or `#` |
| **Timeout** | A temporary block that stops a member from sending messages |
| **Audit log** | A server log that records moderation actions, including bot actions |

## Running and hosting

| Term | Meaning |
| --- | --- |
| **Node.js** | The program that runs your exported bot |
| **Host** | A computer or service that keeps your bot running |
| **Logs** | The text your bot prints while running, including errors |
| **Restart** | Stopping and starting the bot so it loads your latest files |
| **Process manager** | A tool that restarts your bot automatically after a crash |
| **Persistent storage** | Disk space that survives restarts, unlike temporary storage |

## Related pages

- [Create your first bot](/getting-started/quick-start/)
- [Connect blocks](/guides/flows/)
- [Permissions and safety](/help/permissions/)
