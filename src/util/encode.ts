import { IContext } from './context';
import { TokenType } from '../types/TokenType';

export const encodeContext = (
  context: IContext,
  wrapObject: boolean = true,
): string => {
  const comment = context.comment ? `${context.comment}\n\n` : '';
  const parent = context.parent ? `seek ${context.parent.id}\n\n` : '';
  const meta = `${comment}${parent}`;
  const encodedObject = encodeObject(context.values, wrapObject);

  if (encodedObject === TokenType.null) {
    if (context.value === null || typeof context.value === 'undefined') {
      return `${meta}${TokenType.null}`;
    }
    return `${meta}${encodeValue(context.value)}`;
  }

  if (context.value === null) {
    return `${meta}${encodedObject}`;
  }

  return `${meta}${encodedObject}\n\n${encodeValue(context.value)}`;
};

export const encodeObject = (
  object: { [key: string]: any },
  wrapObject: boolean = true,
) => {
  if (Array.isArray(object)) {
    if (object.length === 0) {
      return '[]';
    }
    const inner = object.map(value => encodeValue(value));
    const values =
      object.length === 1
        ? ` ${inner.join('')} `
        : ['']
            .concat(
              inner.map(x => `  ${x.replace(/\n/g, '\n  ')}`),
              [''],
            )
            .join('\n');

    return `[${values}]`;
  }
  const keys = Object.keys(object);
  if (keys.length === 0) {
    return TokenType.null;
  }
  const indentValue = (key: string) => {
    const raw = encodeValue(object[key]);

    if (raw.length > 100 || raw.indexOf('\n') !== -1) {
      return `\n  ${raw.replace(/\n/g, '\n  ')}\n`;
    }

    return raw;
  };

  const inner = keys.map(key => `${key}<${indentValue(key)}>`);

  if (!wrapObject) {
    return inner.join('\n');
  }

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
      return value ? TokenType.on : TokenType.no;
    case 'object':
      if (value === null) {
        return TokenType.null;
      }
      if ('_c_o_n_t_e_x_t_' in value) {
        return encodeContext(value);
      }
      return encodeObject(value);
    case 'undefined':
      return TokenType.null;
    default:
      console.log('1 crash', value);
      return TokenType.crash;
  }
};
