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

Before doing anything, you need to register the node with the respective code generation engine. This can be done using the method `BaseNode.forEngine(<BaseEngine>)`. After registering the nodes, you can call `<BaseGenerator>.graphToCode(litegraphInstance)` to generate your code. This will return an object with the type `{ code: string, meta: string, intents: string }`. It is up to the developer on how they want to implement intents and package requirements with intents being a JSON stringified version of Discord.js' intents.

# Todos

- [ ] Implement `Order` similar to how Blockly does it.
