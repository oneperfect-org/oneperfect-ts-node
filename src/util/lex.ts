import { sparse, IGrammar, INode } from './sparse';

export enum tokens {
  init = 'init',
  word = 'word',
  block = 'block',
  on = 'on',
  no = 'no',
  space = 'space',
}

const grammar: IGrammar = {
  [tokens.init]: {
    '&': /\s+/,
    [tokens.block]: /[\{\}\[\]\(\)\<\>]/,
    [tokens.word]: /\w+/,
  },
  [tokens.word]: {
    '@self': /\w+/,
    '&init': /\s/,
    [tokens.block]: /[\{\}\[\]\(\)\<\>]/,
  },
  [tokens.block]: {
    '&': /\s+/,
    [tokens.block]: /[\{\}\[\]\(\)\<\>]/,
    [tokens.word]: /\w+/,
  },
};

export const lex = (input: string) => {
  const parents = new WeakMap<INode, INode>();

  return sparse(input, grammar, tokens.init, function(node, token) {
    switch (token.name) {
      case tokens.block:
        switch (token.value) {
          case '{':
          case '(':
          case '[':
          case '<':
            node._.push(token);
            parents.set(token, node);
            return token;
          case '}':
            if (
              !parents.has(node) ||
              node.name !== tokens.block ||
              node.value !== '{'
            ) {
              throw new Error('Cannot find opening { for closing }');
            }
            return parents.get(node);
          case ')':
            if (
              !parents.has(node) ||
              node.name !== tokens.block ||
              node.value !== '('
            ) {
              throw new Error('Cannot find opening ( for closing )');
            }
            return parents.get(node);
          case ']':
            if (
              !parents.has(node) ||
              node.name !== tokens.block ||
              node.value !== '['
            ) {
              throw new Error('Cannot find opening [ for closing ]');
            }
            return parents.get(node);
          case '>':
            if (
              !parents.has(node) ||
              node.name !== tokens.block ||
              node.value !== '<'
            ) {
              throw new Error('Cannot find opening < for closing >');
            }
            return parents.get(node);
          default:
            node._.push(token);
            parents.set(token, node);
        }
      default:
        node._.push(token);
        parents.set(token, node);
    }
    return node;
  });
};
