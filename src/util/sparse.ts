export interface INode {
  parent?: INode;
  _?: INode[];
  name: string;
  value?: string;
}

export interface IGrammar {
  [key: string]: { [key: string]: RegExp | string };
}

/**
 * Sparse - Insanely Simple Text Parser
 * @author Nate Ferrero
 *
 * @param string - the string to parse
 * @param grammar - grammatical rules
 * @param token - initial token
 * @param processor - function(node, token)
 */
export const sparse = (
  string: string,
  grammar: IGrammar,
  token: string,
  processor: (node: INode, token: INode) => INode,
) => {
  /**
   * Setup
   */
  let pos = { line: 1, col: 1 };
  let stack: INode = { name: token };
  let node = stack;
  let lastMatch = '';

  /**
   * Match start of string
   */
  let matchStart = function(string: string, match: RegExp | string) {
    /**
     * Check type of match
     * @todo Handle arrays
     */
    switch (typeof match) {
      /**
       * Handle regex matching
       */
      case 'object':
        let matched = new RegExp('^(' + match.source + ')').exec(string);
        return matched !== null ? matched[0] : false;

      /**
       * Handle literal matching
       */
      case 'string':
        return string.substr(0, match.length) === match ? match : false;

      default:
        throw new Error(
          "Parse error: Invalid match type '" + typeof match + "'",
        );
    }
  };

  /**
   * Process while string has characters
   */
  stringLoop: while (string.length) {
    /**
     * Ensure token exists and context is valid
     */
    const context = grammar[token];
    if (typeof context !== 'object')
      throw new Error("Parse error: Undefined token '" + token + "'");

    /**
     * Check all tokens in context
     */
    try {
      for (let test in context) {
        /**
         * Check for match
         */
        let match = matchStart(string, context[test]);

        /**
         * Debugging
         * @author Nate Ferrero
         *$/console.log('Matching:', string, 'and', context[test], 'with result:', match);
        /**/

        /**
         * Handle successful match
         */
        if (match !== false) {
          /**
           * Remove matched portion of string
           */
          string = string.slice(match.length);

          /**
           * Update line and column numbers
           */
          let lines = match.split('\n');
          if (lines.length > 1) {
            pos.line += lines.length - 1;
            pos.col = 1;
          }
          pos.col += lines.pop().length;

          /**
           * Handle & or &token drop
           */
          if (test.charAt(0) == '&') {
            if (test.length > 1) {
              token = test.substr(1);
              lastMatch = match;
            }
            continue stringLoop;
          }

          /**
           * Handle @self and literals
           */
          if (test !== '@self' && test[0] !== '+') {
            token = test;
          }

          /**
           * Process token and continue
           */
          node = processor(node, {
            name: test[0] === '+' ? test.substr(1) : token,
            value: match,
          });
          lastMatch = match;
          continue stringLoop;
        }
      }
    } catch (e) {
      throw new Error(
        `Syntax Error: ${e.message} after ` +
          token +
          " '" +
          lastMatch +
          "'" +
          ' at line ' +
          pos.line +
          ', column ' +
          pos.col +
          ": '" +
          string.slice(0, 15) +
          (string.length > 15 ? '…' : '') +
          "'",
      );
    }

    /**
     * No match at current position
     */
    throw new Error(
      'Parse error: Invalid source after ' +
        token +
        " '" +
        lastMatch +
        "'" +
        ' at line ' +
        pos.line +
        ', column ' +
        pos.col +
        ": '" +
        string.slice(0, 15) +
        (string.length > 15 ? '…' : '') +
        "'",
    );
  }

  /**
   * Return stack
   */
  return stack;
};
