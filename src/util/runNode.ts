import { sparse, IGrammar, INode } from './sparse';
import { loadFile } from './loadFile';
import { context, IContext } from './context';
import { generateId } from './generateId';
import { tokens } from './lex';
import { encode } from './encode';

const runBlock = async (context: IContext, type: string, nodes: INode[]) => {
  switch (type) {
    case '{':
      return '{}';
    case '(':
      return '()';
    case '[':
      return '[]]';
    case '(':
      return '()';
  }
};

const runNodes = async (context: IContext, nodes: INode[]) => {
  return nodes.map(node => runNode(context, node));
};

export const runNode = async (context: IContext, input: INode) => {
  switch (input.name) {
    case tokens.init:
      await runNodes(context, input._);
      break;
    case tokens.block:
      await runBlock(context, input.value, input._);
      break;
    case tokens.word:
      await context.select(input.value);
      break;
    default:
      return { message: `Invalid ${input.name}: "${input.value}"` };
  }

  return {
    data: encode(context),
  };
};
