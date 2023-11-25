import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class StocksService {
    getStocks(): any[] {
        try {
            const data = fs.readFileSync('stocks.json', 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }
}