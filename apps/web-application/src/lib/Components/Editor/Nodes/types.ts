import type { BaseGenerator, BaseNode } from "@disflow-team/code-gen";

/**
 * A concrete node class that can be registered with a code generator and
 * litegraph. Unlike `typeof BaseNode`, this has a non-abstract constructor.
 */
export type NodeClass = (new () => BaseNode) & {
	buildReferenceName(): string;
	forEngine(engine: BaseGenerator): void;
};

/**
 * An event root class also exposes the Discord event constant and callback
 * parameters used by the per-event code generator.
 */
export type EventRootClass = NodeClass & {
	eventName: string;
	payload: string;
	requiredIntents: string[];
};
