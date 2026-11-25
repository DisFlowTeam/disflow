import { LGraphCanvas, LiteGraph } from "litegraph.js";

type UntypedConstants = {
	NODE_SELECTED_TITLE_COLOR: string;
	NODE_DEFAULT_BOXCOLOR: string;
	WIDGET_BGCOLOR: string;
	WIDGET_OUTLINE_COLOR: string;
	WIDGET_TEXT_COLOR: string;
	WIDGET_SECONDARY_TEXT_COLOR: string;
};

const untyped = LiteGraph as unknown as UntypedConstants;

const DOT_GRID = `data:image/svg+xml;utf8,${encodeURIComponent(
	"<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>" +
		"<circle cx='1' cy='1' r='1' fill='#26282e'/></svg>",
)}`;

const PALETTE = {
	background: "#0e0f12",
	surface: "#16181c",
	surfaceRaised: "#1f2126",
	border: "#3f3f46",
	text: "#e4e4e7",
	textMuted: "#a1a1aa",
	link: "#52525b",
	eventLink: "#818cf8",
	connectingLink: "#38bdf8",
	shadow: "rgba(0, 0, 0, 0.5)",
} as const;

let applied = false;

export function applyLiteGraphTheme() {
	if (applied) return;
	applied = true;

	// Metrics and shape.
	LiteGraph.NODE_TITLE_HEIGHT = 34;
	LiteGraph.NODE_SLOT_HEIGHT = 24;
	LiteGraph.NODE_WIDGET_HEIGHT = 26;
	LiteGraph.NODE_TEXT_SIZE = 13;
	LiteGraph.NODE_DEFAULT_SHAPE = "round";
	LiteGraph.NODE_COLLAPSED_RADIUS = 8;

	// Typed constants.
	LiteGraph.NODE_TITLE_COLOR = PALETTE.text;
	LiteGraph.NODE_TEXT_COLOR = PALETTE.textMuted;
	LiteGraph.NODE_DEFAULT_COLOR = PALETTE.surfaceRaised;
	LiteGraph.NODE_DEFAULT_BGCOLOR = PALETTE.surface;
	LiteGraph.DEFAULT_SHADOW_COLOR = PALETTE.shadow;
	LiteGraph.LINK_COLOR = PALETTE.link;
	LiteGraph.EVENT_LINK_COLOR = PALETTE.eventLink;
	LiteGraph.CONNECTING_LINK_COLOR = PALETTE.connectingLink;

	// untyped stuff. present at runtime
	untyped.NODE_SELECTED_TITLE_COLOR = "#ffffff";
	untyped.NODE_DEFAULT_BOXCOLOR = PALETTE.border;
	untyped.WIDGET_BGCOLOR = PALETTE.background;
	untyped.WIDGET_OUTLINE_COLOR = PALETTE.border;
	untyped.WIDGET_TEXT_COLOR = PALETTE.text;
	untyped.WIDGET_SECONDARY_TEXT_COLOR = PALETTE.textMuted;

	(
		LGraphCanvas as unknown as { DEFAULT_BACKGROUND_IMAGE: string }
	).DEFAULT_BACKGROUND_IMAGE = DOT_GRID;
}

export function applyCanvasTheme(canvas: LGraphCanvas) {
	canvas.render_shadows = true;
	canvas.render_canvas_border = false;
	canvas.render_connections_border = false;
	canvas.connections_width = 2;
	canvas.links_render_mode = LiteGraph.SPLINE_LINK;
	canvas.inner_text_font =
		'normal 13px "Inter Variable", Inter, system-ui, sans-serif';
	canvas.background_image = DOT_GRID;

	// clear the cache and set background
	const internals = canvas as unknown as {
		_bg_img?: HTMLImageElement | null;
		_pattern?: CanvasPattern | null;
		_pattern_img?: HTMLImageElement | null;
	};

	internals._bg_img = null;
	internals._pattern = null;
	internals._pattern_img = null;

	canvas.setDirty(true, true);
	
	(
		canvas as unknown as { clear_background_color: string }
	).clear_background_color = PALETTE.background;
}
