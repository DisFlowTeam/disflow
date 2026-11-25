import type { BaseGenerator, BaseNode } from "@disflow-team/code-gen";

/**
 * Words that cannot be used as a binding name in generated code.
 * thanks https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar
 */
const RESERVED_WORDS = new Set([
	"arguments",
	"await",
	"break",
	"case",
	"catch",
	"class",
	"const",
	"continue",
	"debugger",
	"default",
	"delete",
	"do",
	"else",
	"enum",
	"eval",
	"export",
	"extends",
	"false",
	"finally",
	"for",
	"function",
	"if",
	"implements",
	"import",
	"in",
	"instanceof",
	"interface",
	"let",
	"new",
	"null",
	"package",
	"private",
	"protected",
	"public",
	"return",
	"static",
	"super",
	"switch",
	"this",
	"throw",
	"true",
	"try",
	"typeof",
	"undefined",
	"var",
	"void",
	"while",
	"with",
	"yield",
]);

/**
 * Text to javascript identifier
 * e.g. "hello world" -> hello_world
 */
export function toIdentifier(name: unknown, fallback = "myVariable"): string {
	const cleaned = String(name ?? "")
		.trim()
		.replace(/[^\p{ID_Continue}$]+/gu, "_");

	if (cleaned.length === 0) return fallback;

	const prefixed = /^[\p{ID_Start}$_]/u.test(cleaned) ? cleaned : `_${cleaned}`;

	return RESERVED_WORDS.has(prefixed) ? `_${prefixed}` : prefixed;
}

/**
 * Resolve a text input, falling back to a widget property when nothing is connected.
 * Always returns a JavaScript expression.
 */
export function inputOrText(
	generator: BaseGenerator,
	node: BaseNode,
	inputIndex: number,
	property: string,
): string {
	if (node.inputs[inputIndex]?.link != null) {
		return generator.valueToCode(node, inputIndex);
	}

	return JSON.stringify(String(node.properties[property] ?? ""));
}

/**
 * Like inputOrText, but returns null when the widget is empty and no input is
 * connected. Useful for optional API arguments such as kick/ban reasons.
 */
export function inputOrTextOrNull(
	generator: BaseGenerator,
	node: BaseNode,
	inputIndex: number,
	property: string,
): string | null {
	if (node.inputs[inputIndex]?.link != null) {
		return generator.valueToCode(node, inputIndex);
	}

	const value = String(node.properties[property] ?? "").trim();

	return value.length > 0 ? JSON.stringify(value) : null;
}

/**
 * Resolve a numeric input, falling back to a number widget property when
 * nothing is connected. Always returns a JavaScript expression.
 */
export function inputOrNumber(
	generator: BaseGenerator,
	node: BaseNode,
	inputIndex: number,
	property: string,
	fallback = 0,
): string {
	if (node.inputs[inputIndex]?.link != null) {
		return generator.valueToCode(node, inputIndex);
	}

	const value = Number(node.properties[property]);

	return `${Number.isFinite(value) ? value : fallback}`;
}

/**
 * JSON-encode a widget value, or return null when the widget is empty.
 * Used for optional discord.js options that must be omitted entirely.
 */
export function jsonOrNull(value: unknown): string | null {
	const text = String(value ?? "").trim();

	return text.length > 0 ? JSON.stringify(text) : null;
}

export interface ParsedChoice {
	name: string;
	value: string;
}

/**
 * Parse a `Name=Value, Other=other` widget into choice pairs.
 * Entries without an `=` reuse the name as the value.
 */
export function parseChoices(source: unknown): ParsedChoice[] {
	return String(source ?? "")
		.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean)
		.map((entry) => {
			const [namePart, ...valueParts] = entry.split("=");
			const name = namePart.trim();
			const value = valueParts.join("=").trim();

			return { name, value: value.length > 0 ? value : name };
		});
}
