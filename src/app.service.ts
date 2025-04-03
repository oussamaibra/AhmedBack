import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  // constructor(private readonly producerService: ProducerService ){}
  // async getHello() {
  //   await this.producerService.produce({
  //     topic: 'test3',
  //     messages: [
  //       {
  //         value: 'Hello Word',
  //       },
  //     ],
  //   });
  //   return 'Hello World!';
  // }
}
