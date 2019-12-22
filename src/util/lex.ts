import { sparse, IGrammar, INode } from './sparse';
import { TokenType } from '../types/TokenType';

const keywords = {
  [`+${TokenType.crash}`]: /crash\b/,
  [`+${TokenType.code}`]: /code\b/,
  [`+${TokenType.no}`]: /no\b/,
  [`+${TokenType.null}`]: /null\b/,
  [`+${TokenType.on}`]: /on\b/,
  [`+${TokenType.seek}`]: /seek\b/,
  [`+${TokenType.up}`]: /up\b/,
};

const blocks = {
  [TokenType.block]: /[\{\}\[\]\(\)\<\>]/,
};

const comments = {
  [`+${TokenType.comment}`]: /#[^\n]*/,
};

const whitespace = {
  [`+${TokenType.break}`]: /\n|;/,
  '&': /\s+/,
};

const words = {
  [`+${TokenType.number}`]: /(\dx[01]+)|(-?\d+(\.\d*)?)/,
  [`&${TokenType.string}`]: '"',
  [TokenType.word]: /[a-zA-Z]+/,
};

const operators = {
  ...blocks,
  ...comments,
};

const all = {
  ...keywords,
  ...operators,
  ...words,
};

const grammar: IGrammar = {
  [TokenType.init]: {
    ...whitespace,
    ...all,
  },
  [TokenType.word]: {
    '@self': /\w+/,
    '&init': /\s/,
    ...operators,
  },
  [TokenType.block]: {
    ...whitespace,
    ...all,
  },
  [TokenType.string]: {
    '@self': /[^"]+/,
    '&init': '"',
  },
};

export const lex = (input: string) => {
  const parents = new WeakMap<INode, INode>();

  return sparse(input, grammar, TokenType.init, function(node, token) {
    switch (token.name) {
      case TokenType.block:
        switch (token.value) {
          case '{':
          case '(':
          case '[':
          case '<':
            if (!('_' in node)) {
              node._ = [];
            }
            node._.push(token);
            parents.set(token, node);
            return token;
          case '}':
            if (
              !parents.has(node) ||
              node.name !== TokenType.block ||
              node.value !== '{'
            ) {
              throw new Error('Cannot find opening { for closing }');
            }
            return parents.get(node);
          case ')':
            if (
              !parents.has(node) ||
              node.name !== TokenType.block ||
              node.value !== '('
            ) {
              throw new Error('Cannot find opening ( for closing )');
            }
            return parents.get(node);
          case ']':
            if (
              !parents.has(node) ||
              node.name !== TokenType.block ||
              node.value !== '['
            ) {
              throw new Error('Cannot find opening [ for closing ]');
            }
            return parents.get(node);
          case '>':
            if (
              !parents.has(node) ||
              node.name !== TokenType.block ||
              node.value !== '<'
            ) {
              throw new Error('Cannot find opening < for closing >');
            }
            return parents.get(node);
          default:
            if (!('_' in node)) {
              node._ = [];
            }
            node._.push(token);
            parents.set(token, node);
        }
      default:
        if (!('_' in node)) {
          node._ = [];
        }
        node._.push(token);
        parents.set(token, node);
    }
    return node;
  });
};
