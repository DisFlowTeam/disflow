export function graphHasRoot(data: unknown, type: string) {
	const nodes = (data as { nodes?: { type?: string }[] } | null)?.nodes;

	return Array.isArray(nodes) && nodes.some((node) => node.type === type);
}
