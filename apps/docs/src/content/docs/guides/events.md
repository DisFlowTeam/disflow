---
title: Events
description: Make your bot react to messages, new members, reactions and more.
---

Events are moments your bot can react to: someone sends a message, a member joins, a reaction is
added, and so on. Each event has its own graph, so you can build one behaviour per event.

## Turning on an event

1. Open **Events**.
2. Switch on the event you want, for example **Message**.
3. Select the event to open its editor.
4. Build your graph and select **Save**.

Switching an event off keeps its graph but stops that behaviour from being included when you export
your bot.

## Available events

| Event | Your bot reacts when… | Discord setting |
| --- | --- | --- |
| Ready | The bot comes online | — |
| Message | Someone sends a message | Message Content |
| Message Update | A message is edited | Message Content |
| Message Delete | A message is deleted | Message Content |
| Message Delete Bulk | Several messages are deleted at once | Message Content |
| Guild Create | The bot joins a server | — |
| Guild Delete | The bot is removed from a server | — |
| Guild Update | A server's details change | — |
| Guild Member Add | Someone joins a server | Server Members |
| Guild Member Remove | Someone leaves a server | Server Members |
| Guild Member Update | A member's nickname, roles or details change | Server Members |
| Channel Create | A channel is created | — |
| Channel Delete | A channel is deleted | — |
| Channel Update | A channel's settings change | — |
| Channel Pins Update | A message is pinned or unpinned | — |
| Message Reaction Add | Someone adds a reaction | — |
| Message Reaction Remove | Someone removes a reaction | — |
| Message Reaction Remove All | All reactions are removed from a message | — |
| Message Reaction Remove Emoji | One emoji's reactions are removed | — |
| Interaction Create | Someone uses a button, menu or command | — |
| Voice State Update | Someone joins, leaves or moves in voice | — |
| Presence Update | Someone's online status changes | Presence |
| Typing Start | Someone starts typing | — |
| User Update | A user's username or avatar changes | Server Members |

:::caution[Turn on the right settings in Discord]
Some events need a setting enabled in the **Discord Developer Portal** under **Bot**:

- **Message Content** for message events.
- **Server Members** for member events.
- **Presence** for presence events.

Without them, Discord will not send the information your bot needs.
:::

## Reading information from an event

Each event editor gives you an **Event Value** block. It lets you pick the information that came
with the event — the message, the member, the channel, the reaction or the user.

To read a specific detail, connect **Event Value** to **Get Property** and enter a path such as:

- `author.username` — who sent a message.
- `guild.name` — the server's name.
- `channel.id` — the channel's ID.

**Get Property** returns nothing instead of failing when a detail is missing, so it is safe to use
on information that may not always be there.

## Example: reply to a message

1. Turn on **Message**.
2. Open the editor.
3. Add **Reply To Message**.
4. Connect **Event Value** (`message`) to the block's **Message** input.
5. Type your reply, for example `Hello!`, in the **Content** field.
6. **Save**.

To reply only to specific messages, add **If** and **Text Includes** before **Reply To Message**.

## Interaction Create and slash commands

Slash commands you create in the **Commands** page have their own editor and their own behaviour.
If you also turn on **Interaction Create**, both handlers run when someone uses a command. That can
lead to two replies.

Use **Interaction Create** for buttons, menus and other interactions. If you only need slash
commands, leave it off.

## Related pages

- [Slash commands](/guides/slash-commands/)
- [Connect blocks](/guides/flows/)
- [Block reference](/reference/node-catalog/)
- [Permissions and safety](/help/permissions/)
- [Glossary](/help/glossary/)
