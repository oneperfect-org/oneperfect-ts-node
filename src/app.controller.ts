import { Body, Controller, Get, Post, Header } from '@nestjs/common';
import { AppService } from './app.service';

export class QueryDto {
  readonly query: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello() {
    return this.appService.getHello();
  }

  @Post('/query')
  async postQuery(@Body() body: QueryDto) {
    return this.appService.postQuery(body.query);
  }
}
