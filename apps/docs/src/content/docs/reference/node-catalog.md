---
title: Block reference
description: Every block in the editor and what it does.
---

Blocks are grouped by category in the editor menu. The blocks you see depend on where you are
working — an event editor offers event information, while the main file offers general-purpose
blocks.

## Console

| Block | What it does |
| --- | --- |
| Print | Shows text in the bot's console |
| Clear Console | Clears the console output |
| Input | Asks for text in the console |
| Throw Error | Stops the graph and reports an error |

## Control

| Block | What it does |
| --- | --- |
| If | Chooses between two paths based on a condition |
| While | Repeats while a condition stays true |
| Repeat | Repeats a set number of times |
| For Each | Runs once for every item in a list |
| Switch | Chooses between several cases |
| Try Catch | Keeps the bot running when part of the graph fails |
| Wait | Pauses before continuing |
| Boolean | Provides a true or false value |
| Null | Provides an empty value |
| Comparison | Compares two values, such as “is greater than” |

## Maths

| Block | What it does |
| --- | --- |
| Number | Provides a number you type in |
| Operate | Adds, subtracts, multiplies or divides |
| MathFunctions | Advanced calculations such as absolute value or square root |
| Random Number | Picks a random number |
| Round Number | Rounds a number up, down or to the nearest whole number |

## Text Tools

| Block | What it does |
| --- | --- |
| Text | Provides text you type in |
| New Line | Adds a line break |
| Create Text With | Joins several pieces of text together |
| Replace Text | Finds and replaces part of a text |
| Reverse Text | Reverses the characters |
| Text Length | Counts the characters |
| Text Includes | Checks whether text contains something |
| Text Starts With | Checks how text begins |
| Text Ends With | Checks how text ends |

## Variables

| Block | What it does |
| --- | --- |
| Create Variable | Stores a value under a name |
| Set Variable | Changes a stored value |
| Variable | Reads a stored value |

## Data

| Block | What it does |
| --- | --- |
| Create List | Makes a list of values |
| Add To List | Adds an item to a list |
| Get List Item | Reads one item from a list |
| List Length | Counts the items in a list |
| Join List | Combines a list into text |
| Random Item | Picks a random item from a list |
| JSON Parse | Turns JSON text into usable data |
| JSON Stringify | Turns data into JSON text |
| Current Time | Gets the current date and time |
| Format Date | Displays a date in a readable format |
| Date Difference | Measures the time between two dates |

## Database

The database blocks store information that survives restarts, such as points, settings or
reminders.

| Block | What it does |
| --- | --- |
| Open Database | Opens a database file |
| Set Value | Stores a value under a key |
| Get Value | Reads a stored value |
| Delete Value | Removes a value |
| Has Key | Checks whether a key exists |
| Add To Number | Increases a stored number |
| Subtract From Number | Decreases a stored number |
| Push To List | Adds an item to a stored list |
| Get All Entries | Reads everything in the database |
| Clear Database | Removes all stored entries |

## Discord

| Block | What it does |
| --- | --- |
| Get Property | Reads a detail from a Discord object, such as `author.username` |
| Get Bot Client | Refers to the running bot |
| Fetch Message | Looks up a message by channel and message ID |
| Fetch User | Looks up a user by ID |
| Set Presence | Changes the bot's status or activity |

## Messages

| Block | What it does |
| --- | --- |
| Send Message | Posts a message in a channel |
| Reply To Message | Replies to an existing message |
| Edit Message | Changes a message the bot sent |
| Delete Message | Deletes a message |
| Add Reaction | Adds an emoji reaction |
| Remove Reaction | Removes a reaction |
| Send DM | Sends a direct message to a member |
| Send File | Uploads a file |
| Send Typing | Shows “bot is typing…” in a channel |
| Pin Message | Pins a message |
| Unpin Message | Unpins a message |
| Bulk Delete Messages | Deletes several messages at once |

The **Message** category adds **Message Content** and **Message Author** for message events.

## Members

| Block | What it does |
| --- | --- |
| Add Role | Gives a role to a member |
| Remove Role | Takes a role away |
| Find Role | Looks up a role in the server |
| Create Role | Creates a new role |
| Delete Role | Deletes a role |
| Find Member | Looks up a member |
| Kick Member | Removes a member from the server |
| Ban Member | Bans a member |
| Unban Member | Lifts a ban |
| Timeout Member | Stops a member from sending messages for a while |
| Remove Timeout | Ends a timeout early |
| Set Nickname | Changes a member's nickname |
| Move Member To Voice | Moves a member to another voice channel |
| Disconnect From Voice | Disconnects a member from voice |

## Channels

| Block | What it does |
| --- | --- |
| Find Channel | Looks up a channel |
| Create Channel | Creates a new channel |
| Delete Channel | Deletes a channel |
| Rename Channel | Renames a channel |
| Set Channel Topic | Changes a channel's topic |
| Set Slowmode | Limits how often members can post |
| Set Channel Permissions | Changes who can do what in a channel |
| Create Invite | Creates an invite link |
| Create Thread | Starts a thread |
| Archive Thread | Archives a thread |
| Unarchive Thread | Reopens an archived thread |
| Add Member To Thread | Adds someone to a thread |
| Remove Member From Thread | Removes someone from a thread |

## Embeds

| Block | What it does |
| --- | --- |
| Create Embed | Starts a rich embed |
| Add Embed Field | Adds a titled field to an embed |
| Send Embed | Posts an embed in a channel |
| Reply With Embed | Replies to a message with an embed |

## Components

| Block | What it does |
| --- | --- |
| Create Action Row | Holds buttons or a menu in one row |
| Create Button | Adds a clickable button |
| Create Select Menu | Adds a dropdown menu |
| Add Text Input | Adds a field to a pop-up form |
| Send With Components | Sends a message with buttons or menus attached |

## Interaction

| Block | What it does |
| --- | --- |
| Interaction | Provides the current interaction |
| Interaction Type | Tells you what kind of interaction it is |
| Get int type | Provides the interaction type as a number |
| Get Interaction Value | Reads a value from the interaction |
| Is Interaction Type | Checks whether it is a particular type |
| Get Command Option | Reads an option from a slash command |
| Get Subcommand | Reads the subcommand that was used |
| Get Subcommand Group | Reads the subcommand group that was used |
| Subcommand Match | Compares the subcommand to a value |
| Get Focused Option | Reads the option being autocompleted |
| Get Text Input | Reads a field from a pop-up form |
| Get Selection | Reads a selected menu value |
| Reply To Interaction | Sends the first response |
| Defer Reply | Buys more time before replying |
| Edit Reply | Changes a response |
| Delete Reply | Removes a response |
| Follow Up | Sends another message after replying |
| Update Interaction | Updates a button or menu interaction |
| Defer Update | Acknowledges without changing the interaction |
| Show Modal | Opens a pop-up form |
| Await Button Click | Waits for someone to press a button |
| Await Message | Waits for a follow-up message |
| Respond To Autocomplete | Sends autocomplete suggestions |

## Event Data

| Block | What it does |
| --- | --- |
| Event Value | Provides the information sent with an event, such as the member or message |

## Start blocks

Every graph starts at a start block: **On Start**, an event block such as **Guild Member Add**, or
**On Command**. See [Events](/guides/events/) for the full list.

## A missing block?

If a block you expect is not in the menu, it is not available in that editor. General-purpose
blocks are in the main file; event information only appears in event editors.

## A missing block in the docs?

If a block you see in the UI is not here, please either [open an issue](https://github.com/DisFlowTeam/disflow/issues) or
create a [pull request](https://github.com/DisFlowTeam/disflow/pulls) to add the said block. We always welcome new contributors :)