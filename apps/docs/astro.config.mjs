import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import mermaid from "astro-mermaid";

export default defineConfig({
	site: !process.env.NODE_ENV || process.env.NODE_ENV === "development" ?
		undefined : "https://docs.disflow.1980s.tech",
	integrations: [
		// Must come before Starlight so mermaid code blocks are transformed.
		mermaid({
			autoTheme: true,
			enableLog: false,
		}),
		starlight({
			title: "DisFlow",
			description:
				"Documentation for DisFlow, the visual node-based builder for Discord apps.",
			logo: {
				src: "./src/assets/logo.svg",
				alt: "DisFlow",
			},
			favicon: "/favicon.svg",
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/DisFlowTeam/disflow",
				},
			],
			editLink: {
				baseUrl: "https://github.com/DisFlowTeam/disflow/edit/main/apps/docs/",
			},
			lastUpdated: true,
			customCss: ["./src/styles/custom.css"],
			sidebar: [
				{
					label: "Getting started",
					items: [
						{ label: "Overview", link: "/" },
						{
							label: "Create your first bot",
							slug: "getting-started/quick-start",
						},
					],
				},
				{
					label: "Guides",
					items: [
						{ label: "The editor", slug: "guides/editor" },
						{ label: "Connect blocks", slug: "guides/flows" },
						{ label: "Events", slug: "guides/events" },
						{ label: "Slash commands", slug: "guides/slash-commands" },
						{
							label: "Environment variables",
							slug: "guides/environment-variables",
						},
						{
							label: "Exporting your bot",
							slug: "guides/exporting",
						},
						{
							label: "Keeping your bot online",
							slug: "guides/hosting",
						},
					],
				},
				{
					label: "Help",
					items: [
						{ label: "Troubleshooting", slug: "help/troubleshooting" },
						{ label: "Your data and safety", slug: "help/your-data" },
						{
							label: "Permissions and safety",
							slug: "help/permissions",
						},
						{ label: "Glossary", slug: "help/glossary" },
					],
				},
				{
					label: "Reference",
					items: [{ label: "Block reference", slug: "reference/node-catalog" }],
				},
				{ label: "Self-hosting", slug: "self-hosting" },
			],
		}),
	],
});
