import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { BrokersService } from './brokers.service';

@Controller('brokers')
export class BrokersController {
    constructor(private readonly brokersService: BrokersService) {}

    @Get()
    getBrokers(): any[] {
        return this.brokersService.getBrokers();
    }

    @Post()
    addBroker(@Body() broker: any): void {
        this.brokersService.addBroker({ id: this.brokersService.generateBrokerId(), ...broker });
    }

    @Delete(':id')
    deleteBroker(@Param('id') id: string): void {
        this.brokersService.deleteBroker(parseInt(id, 10));
    }

    @Patch(':id/balance')
    updateBalance(@Param('id') id: string, @Body('balance') balance: number): void {
        this.brokersService.updateBrokerBalance(parseInt(id, 10), balance);
    }
}