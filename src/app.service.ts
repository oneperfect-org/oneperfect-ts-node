import { Injectable } from '@nestjs/common';
import { lex } from './util/lex';
import { runNode, runProgram } from './util/runNode';
import { context } from './util/context';
import { generateId } from './util/generateId';
import { highResTime } from './util/highResTime';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async postQuery(query: string) {
    const start = highResTime();
    try {
      const rootContext = context(generateId(), null, {});
      const contents = await runProgram(rootContext, lex(query));
      return {
        start,
        end: highResTime(),
        contents,
      };
    } catch (e) {
      console.error(e);
      return {
        start,
        end: highResTime(),
        message: e.message,
      };
    }
  }
}
