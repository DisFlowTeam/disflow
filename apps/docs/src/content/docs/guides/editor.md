---
title: The editor
description: Get comfortable with the canvas, the block menu and saving your work.
---

The editor is the canvas where you build your bot. Blocks appear as cards; you move them around
and connect them to create behaviour.

## Moving around

| Do this | Result |
| --- | --- |
| Drag empty canvas | Move around the workspace |
| Scroll the mouse wheel | Zoom in and out |
| Click a block | Select it |
| Drag a block by its title | Move it |
| Press <kbd>Delete</kbd> | Remove the selected block |
| Press <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> | Copy and paste blocks |

## Adding blocks

Right-click anywhere on the canvas and choose a block from the menu, or double-click the canvas to
search. Blocks are grouped by what they do — messages, members, roles, channels, commands and so
on.

The blocks offered depend on where you are:

- The **Main file** editor has general-purpose blocks.
- An **event** editor adds blocks for that event's information, such as the member who joined.
- A **command** editor adds the blocks used to reply to slash commands.

If a block is missing, it is not available in that part of the bot.

## Editing a block

Select a block and change its settings directly on the card. Depending on the block you will see
text fields, dropdowns, number inputs or switches.

Some settings change the block's connections. For example, leaving a text field empty can reveal
an input so you can plug in a value from another block instead.

## Connecting blocks

Blocks connect on their left and right edges. One kind of connection controls **what happens next**;
the other passes **information** between blocks.

See [Connect blocks](/guides/flows/) for a visual explanation.

## Saving your work

The **Save** button sits in the top-right corner of the canvas. Your bot is stored in your browser,
so save before closing the tab or moving to another page in DisFlow.

:::caution[Export uses saved graphs]
Exporting your bot uses the last saved version, not the changes currently on screen. Save every
graph before selecting **Export bot**.
:::

## Where should I put my blocks?

| Page | Use it for |
| --- | --- |
| **Main file** | Set-up that runs once when the bot starts |
| **Events** | Reacting to things that happen, like messages or new members |
| **Commands** | Building slash commands such as `/ping` |
| **Variables** | Storing private keys for external services |

## A quick tip

Smaller graphs are easier to follow. If one graph becomes a spiderweb, move the overlapping parts
apart and group related blocks together. The canvas has plenty of room.

## Related pages

- [Connect blocks](/guides/flows/)
- [Events](/guides/events/)
- [Glossary](/help/glossary/)
