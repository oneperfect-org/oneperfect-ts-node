import { Injectable } from '@nestjs/common';
import { lex } from './util/lex';
import { runNode } from './util/runNode';
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
      const contents = await runNode(rootContext, lex(query));
      return {
        start,
        end: highResTime(),
        contents,
      };
    } catch (e) {
      return {
        start,
        end: highResTime(),
        message: e.message,
      };
    }
  }
}
