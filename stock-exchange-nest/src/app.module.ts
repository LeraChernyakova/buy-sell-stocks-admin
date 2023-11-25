import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {BrokersModule} from "./brokers/brokers.module";
import {StocksModule} from "./stocks/stocks.module";
import {BrokersController} from "./brokers/brokers.controller";
import {StocksController} from "./stocks/stocks.controller";
import {BrokersService} from "./brokers/brokers.service";
import {StocksService} from "./stocks/stocks.service";
import {SocketService} from "./socket/socket.service";

@Module({
  imports: [BrokersModule, StocksModule],
  controllers: [
    AppController,
    BrokersController,
    StocksController
  ],
  providers: [
    AppService,
    BrokersService,
    StocksService,
    SocketService
  ],
})
export class AppModule {}
