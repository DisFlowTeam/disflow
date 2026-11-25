---
title: Self-hosting
description: Run the DisFlow editor yourself from source.
---

This page is only for running the **DisFlow app** yourself. If you already have DisFlow open, you
do not need anything here — start with [Create your first bot](/getting-started/quick-start/).

## Requirements

- **Node.js 18 or newer**
- **Yarn 4** — the project is pinned to `yarn@4.12.0`
- **Git**

Enable Corepack if Yarn 4 is not available yet:

```bash
corepack enable
```

## Run locally

```bash
git clone https://github.com/DisFlowTeam/disflow.git
cd disflow
yarn install
yarn build:packages
yarn dev
```

Open <http://localhost:5173>. Leave the terminal running while you use DisFlow.

## Update an existing copy

```bash
git pull
yarn install
yarn build:packages
yarn dev
```

## Build for a server

```bash
yarn build
```

The web app is a SvelteKit application. Deploy its build output using the SvelteKit adapter for
your host (the project uses `adapter-auto`). The token-checking endpoint needs a host that can run
server code — a purely static file host will not work. Serve it over **HTTPS** so the browser's
encryption features work as expected.

## Where your data lives

DisFlow keeps everything in the browser on the computer where you use it:

- Bots, graphs, tokens and variables are stored locally in that browser.
- They are not synced between browsers, devices or people.
- Clearing the browser's site data deletes them.
- The 6-digit passcode cannot be recovered, and neither can data encrypted with it.

There is no account system and no database server.

## Commands

| Command | What it does |
| --- | --- |
| `yarn dev` | Build the packages, then start the editor at `http://localhost:5173` |
| `yarn build` | Build every workspace |
| `yarn build:packages` | Rebuild only the shared packages |
| `yarn format-and-lint` | Check formatting and lint |
| `yarn docs:dev` | Start this documentation site at `http://localhost:4321` |
| `yarn docs:build` | Build the documentation as static files |

## If something looks wrong

- **Changes to the app don't appear:** the editor uses the built packages. Run
  `yarn build:packages` and reload.
- **Wrong Yarn version:** run `corepack enable` and try again.
- **Port already in use:** stop the other process, or start Vite on another port with
  `yarn workspace web-application dev --port 5174`.
- **Creating a bot fails:** check your internet connection and make sure the token is copied
  correctly from the Discord Developer Portal.

## Documentation site

This site is an Astro Starlight project in `apps/docs`. To work on it:

```bash
yarn install
yarn docs:dev
```

Pages live in `apps/docs/src/content/docs/`, and the sidebar is configured in
`apps/docs/astro.config.mjs`. See `apps/docs/README.md` for deployment notes.
