---
title: Connect blocks
description: Learn the two kinds of connections and how information travels through a graph.
---

Blocks talk to each other through connections. There are two kinds, and understanding the
difference is the key to building almost anything in DisFlow.

## What happens next

Connections that control the order of events are shown as arrows between the right side of one
block and the left side of the next.

![Message Reply Diagram](/MESSAGE_REPLY_PONG.png)

The blocks run from left to right, one after another. This is how you say “when this happens, do
that”.

Each block can only lead to **one** next block. If you need two different things to happen, use a
control block such as **If** or **Switch** to choose a path.

## Passing information

The other kind of connection carries a value — text, a number, a member, a message, and so on.
These connections usually go from the right side of one block into the left side of another.

![Passing Data Diagram](/PASSING_INFO.png)

Here, the text block provides the message content, and the "reply to message block" sends it.

Values can be used in more than one place. For example, the same member can be used to add a role
and to read their username.

## A complete example

This graph replies to every message:

1. **Message** starts the graph when someone posts.
2. **Event Value** provides the `message`.
3. **Reply To Message** answers it with your text.

![Complete example](/COMPLETE_EXAMPLE.png)

You can use the same message in several blocks. For example, **Get Property** can read
`author.username` to personalise the reply.

## The start block

Every graph begins with a start block:

- **On Start** in the main file, events and commands.
- An **event block** such as **Guild Member Add** when you are editing an event.
- **On Command** when you are editing a slash command.

Blocks that are not connected to the start block will not run. If a block seems to do nothing,
check that it is linked into the chain.

## Tips

- Follow the arrows from the start block to see exactly what your bot does, in order.
- If you cannot connect two blocks, their connection types do not match. Try a block that converts
  the value, such as **Text** or **Get Property**.
- Keep related blocks close together. A tidy graph is much easier to debug.
- Use **Save** often.

## Related pages

- [The editor](/guides/editor/)
- [Events](/guides/events/)
- [Slash commands](/guides/slash-commands/)
