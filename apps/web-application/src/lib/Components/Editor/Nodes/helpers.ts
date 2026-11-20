import type { BaseGenerator, BaseNode } from "@disflow-team/code-gen";

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
