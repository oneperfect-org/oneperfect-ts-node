import { generateId } from './generateId';

export interface IContextValues {
  [key: string]: any;
}

export interface IContext {
  id: string;
  parent?: IContext;
  values: IContextValues;
  select(name: string): Promise<void>;
  withValues(values: IContextValues): IContext;
}

const globalValues = {
  process: {
    id: generateId(),
    start: Date.now(),
  },
  now: Date.now,
  help() {
    return `
    Welcome to the 1perfect language tutorial

      • more information at https://1perfect.org/
      • suggested file extension is *.1p

    Syntax:
      <context> .. enters context as new global
      name<1> .... sets "name" to 1 in current context
      { name } ... selects "name" from current context
                   (all queries are automatically wrapped in { },
                    so you don't need to add these at the top
                    or you will create a double-nested query)
      ( name ) ... TBD
      [ name ] ... TBD

    Language reserved keywords:
      crash ...... immediately terminate execution
      space ...... i.e. void / null / undefined / empty
      on ......... i.e. boolean true
      no ......... i.e. boolean false
      seek ....... navigate to location
      up ......... enters parent context as new global
                   (will crash if already at root)

    Default global values:
      now ........ current unix time in ms, i.e. ${Date.now()}
      parent ..... parent context, if not at root
      process .... { id<...>, start<...> }

    Language features:
    `
      .replace(/\n    /g, '\n')
      .trim();
  },
};

export const context = (id, parent: any, values: IContextValues): IContext => ({
  id,
  parent,
  values,
  withValues(values: { [key: string]: any }) {
    return context(generateId(), parent, values);
  },
  async select(name: string) {
    if (name in globalValues) {
      if (typeof globalValues[name] === 'function') {
        this.values[name] = globalValues[name]();
      } else {
        this.values[name] = globalValues[name];
      }
    } else {
      this.values[name] = null;
    }
  },
});
