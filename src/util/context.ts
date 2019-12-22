import { generateId } from './generateId';
import { helpContent } from '../content/helpContent';
import { IResult } from '../types/IResult';
import { readNumber } from './readNumber';
import { TokenType } from '../types/TokenType';

export interface IContextValues {
  [key: string]: any;
}

export interface IContext {
  code?: boolean;
  comment?: string;
  id: string;
  key?: string;
  parent?: IContext;
  value?: any;
  values: IContextValues;
  applyBreak(): IResult;
  applyCode(value: any): IResult;
  applyComment(comment: string): IResult;
  applyKey(name: string): IResult;
  applyKey(name: string): IResult;
  applyKeyword(keyword: TokenType): IResult;
  applyNumber(name: string): IResult;
  applyValue(value: any): IResult;
  branchPermanent(values: IContextValues): IContext;
  branchTemporary(): IContext;
  readThisKeyValueFromParent(): any;
  readKeyValue(key: string): any;
  selectValues(names: string[]): IContext;
  _c_o_n_t_e_x_t_: true;
}

const globalValues = {
  process: {
    id: generateId(),
    start: Date.now(),
  },
  now: Date.now,
  help() {
    return helpContent;
  },
};

export const context = (
  id: string,
  parent: null | IContext,
  values: IContextValues,
): IContext => ({
  _c_o_n_t_e_x_t_: true,
  id,
  code: false,
  key: null,
  parent,
  value: null,
  values,
  applyBreak() {
    if (this.key !== null) {
      this.value = this.readKeyValue(this.key);
    }
  },
  applyCode(value) {
    this.applyValue(value);
    this.code = false;
  },
  applyComment(comment) {
    this.comment = this.comment ? `${this.comment}\n${comment}` : comment;
  },
  applyKey(name) {
    if (name in globalValues) {
      if (typeof globalValues[name] === 'function') {
        this.values[name] = globalValues[name]();
      } else {
        this.values[name] = globalValues[name];
      }
    } else {
      this.key = name;
      this.value = null;
    }
  },
  applyKeyword(keyword) {
    switch (keyword) {
      case TokenType.code:
        if (this.code) {
          return { message: `Unexpected successive keyword: ${keyword}` };
        }
        this.code = true;
        break;
      default:
        return { message: `Unexpected keyword: ${keyword}` };
    }
  },
  applyNumber(value) {
    this.applyValue(readNumber(value));
  },
  applyValue(value) {
    console.log('applyValue', this.key, value);
    if (this.key) {
      this.values[this.key] = value;
      this.key = null;
    } else {
      this.value = value;
    }
  },
  branchPermanent(values) {
    return context(generateId(), parent, values);
  },
  branchTemporary() {
    return context('#', this, {});
  },
  readKeyValue(key) {
    if (key.match(/-?\d+(\.\d*)?/)) {
      throw new Error('Should replace with real number parsing');
      return parseFloat(key);
    }
    if (!(key in this.values)) {
      if (this.parent && key in this.parent.values) {
        return this.parent.values[key];
      }
      return { message: `Cannot select undefined value: "${key}"` };
    }
    return this.values[key];
  },
  readThisKeyValueFromParent() {
    if (this.value !== null) {
      return this.value;
    }
    if (this.key === null) {
      return null;
    }
    return this.parent.readKeyValue(this.key);
  },
  selectValues(names) {
    const scope = {};
    names.forEach(name => {
      scope[name] = this.readKeyValue(name);
    });
    return this.branchPermanent(scope);
  },
});
