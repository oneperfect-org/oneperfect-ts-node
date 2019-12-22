import { IContext } from './context';
import { tokens } from './lex';

export const encode = (context: IContext): string => {
  const parent = context.parent ? `seek<${context.parent}>\n\n` : '';

  return `${parent}${encodeObject(context.values)}`;
};

export const encodeObject = (object: { [key: string]: any }) => {
  const keys = Object.keys(object);
  if (keys.length === 0) {
    return tokens.space;
  }
  const inner = keys.map(key => `${key}<${encodeValue(object[key])}>`);
  const values =
    keys.length === 1
      ? ` ${inner.join('')} `
      : ['']
          .concat(
            inner.map(x => `  ${x.replace(/\n/g, '\n  ')}`),
            [''],
          )
          .join('\n');

  return `{${values}}`;
};

export const encodeValue = (value: any): string => {
  switch (typeof value) {
    case 'number':
      return value.toString();
    case 'string':
      const string = JSON.stringify(value);
      if (string.length < 100) {
        return string;
      }
      return `"\n${value}\n"`;
    case 'boolean':
      return value ? tokens.on : tokens.no;
    case 'object':
      if (value === null) {
        return tokens.space;
      }
      return encodeObject(value);
    default:
      return 'crash';
  }
};
