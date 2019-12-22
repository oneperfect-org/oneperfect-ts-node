import { INode } from './sparse';
import { IContext } from './context';
import { encodeContext } from './encode';
import { asyncSome } from './asyncSome';
import { TokenType } from '../types/TokenType';
import { IResult } from 'src/types/IResult';

const runBlock = async (
  context: IContext,
  type: string,
  nodes: INode[],
): Promise<IResult> => {
  if (context.code) {
    context.applyCode(nodes);
    return;
  }
  switch (type) {
    case '{':
      const result = nodes.find(node => {
        if (node.name !== TokenType.word) {
          return true;
        }
      });
      if (result) {
        return {
          message: `Invalid syntax, cannot select non-word near ${result.value}`,
        };
      }
      context.applyValue(context.selectValues(nodes.map(node => node.value)));
      break;
    case '(':
      console.log('2 crash', '()');
      return TokenType.crash;
    case '[':
      console.log('3 crash', '[]');
      return TokenType.crash;
    case '<':
      const child = context.branchTemporary();
      runNodes(child, nodes);
      context.applyValue(child.readThisKeyValueFromParent());
      break;
    default:
      return { message: `Unsupported block type: "${type}"` };
  }
};

const runNodes = async (context: IContext, nodes: INode[]) => {
  const result = asyncSome(nodes, node => runNode(context, node));
  if (result) {
    return result;
  }
  context.applyBreak();
};

export const runNode = async (
  context: IContext,
  input: INode,
): Promise<IResult> => {
  let result: IResult;
  switch (input.name) {
    case TokenType.init:
      if ('_' in input) {
        result = await runNodes(context, input._);
        if (result) {
          return result;
        }
        break;
      }
      return TokenType.null;
    case TokenType.block:
      if ('_' in input) {
        result = await runBlock(context, input.value, input._);
        if (result) {
          return result;
        }
        break;
      }
      return TokenType.null;
    case TokenType.word:
      result = await context.applyKey(input.value);
      if (result) {
        return result;
      }
      break;
    case TokenType.null:
      result = await context.applyValue(null);
      if (result) {
        return result;
      }
      break;
    case TokenType.no:
      result = await context.applyValue(false);
      if (result) {
        return result;
      }
      break;
    case TokenType.on:
      result = await context.applyValue(true);
      if (result) {
        return result;
      }
      break;
    case TokenType.crash:
    case TokenType.seek:
    case TokenType.up:
      return input.name as TokenType;
    case TokenType.break:
      result = await context.applyBreak();
      if (result) {
        return result;
      }
      break;
    case TokenType.number:
      result = await context.applyNumber(input.value);
      if (result) {
        return result;
      }
      break;
    case TokenType.string:
      result = await context.applyValue(input.value);
      if (result) {
        return result;
      }
      break;
    case TokenType.code:
      result = context.applyKeyword(TokenType.code);
      if (result) {
        return result;
      }
      break;
    case TokenType.comment:
      result = context.applyComment(input.value);
      break;
    default:
      return { message: `Unsupported ${input.name} token: "${input.value}"` };
  }
};

export const runProgram = async (context: IContext, node: INode) => {
  const result = await runNode(context, node);
  context.applyBreak();
  if (result && result !== TokenType.null) {
    if (typeof result === 'object' && result.message) {
      return result;
    }

    return {
      data: `${encodeContext(context, false)}\n\n${result}`,
    };
  }

  return {
    data: encodeContext(context, false),
  };
};
