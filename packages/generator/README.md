# DisFlow code generator

`@disflow/code-gen` is the package responsible for generating code for litegraph's graphs.

# Implementation

## Node

`@disflow/code-gen` requires all the nodes inside the graph to be the child of the abstract class `BaseNode` (`class MyNode extends BaseNode`). This class provides the foundation for generating code via its nodeToCode() function which developers must implement themselves. Please view `/src/nodes/BaseNode.ts` for more info.

## Code generator

The code generators use the algorithm very similar to Blockly. Developers may generate code through the use of `<BaseGenerator>.graphToCode()`.

### BaseGenerator

`BaseGenerator` is the abstract class which developers can use to build their own code generators. View `/src/generator/BaseGEnerator.ts` for more info.

### JavaScriptGenerator

`JavaScriptGenerator` is the built in generator for disflow. It handles code generation for BaseNodes for JavaScript.

### statementToCode and valueToCode

These two are methods that nodes will use to generate code for their branches. These names are derived from Blockly. Feel free to skip this section if you are familiar with Blockly.

- `valueToCode`: Used for any inputs of data. In a tree structure, this walks up to all the nodes connected to the input slot.
- `statementCode`: Used for execution flow. Useful for control flow nodes. In a tree structure, this walks from the output node down to all the connected nodes.

# Code Generation

Before doing anything, you need to register the node with the respective code generation engine. This can be done using the method `BaseNode.forEngine(<BaseGenerator>)`. After registering the nodes, you can call `<BaseGenerator>.graphToCode(litegraphInstance)` to generate your code. This will return an object with the type `{ code: string, meta: string, intents: string }`. It is up to the developer on how they want to implement intents and package requirements with intents being an array of Discord intents.

# Basic node implementation

A basic node can be implemented as the following. Let us look at a simple node that ouputs `console.log()`.

```ts
import { BaseGenerator, BaseNode, FlowIOTypes } from '@disflow-team/code-gen';
import { NodeCategoryColor } from '../Colors';

export class Print extends BaseNode {
	static title: string = 'Print';
	static category: string = 'Console';

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Console);
		this.addInput('Content', FlowIOTypes.Any);
		this.addProperty('content', '', FlowIOTypes.String);

		this.addWidget(
			'text',
			'Content',
			'',
			(v: string) => {
				if (v.trim() === '' && !this.inputs.at(1)) this.addInput('content', FlowIOTypes.Any);
				else if (this.inputs.at(1)) this.removeInput(1);

				this.properties.content = v;
			},
			{
				property: 'content'
			}
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const printValue =
			this.inputs[1].link == null
				? JSON.stringify(this.properties.content)
				: generator.valueToCode(this, 1);

		return `console.log(${printValue});`;
	}
}
```

Note the use of `valueToCode()` from the instance of `BaseGenerator`. Let's we are connected this node's input to an "add" node that adds two numbers together. If this is the case, `valueToCode()` will walk to each node that is connected to the input **recursively up the input chain** until it can no longer fine the inputs (generating code for each along the way). Let us see how to register this node for the `JavaScriptGenerator` class.

```ts
import { Print } from "./print.ts";

const generator = new JavaScriptGenerator();
// register to the JavaScriptGenerator's cache for code generation.
Print.forEngine(generator);
```

# Todos

- [ ] Implement `Order` similar to how Blockly does it.
