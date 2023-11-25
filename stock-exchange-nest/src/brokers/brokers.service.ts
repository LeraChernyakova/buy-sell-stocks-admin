import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class BrokersService {
    getBrokers(): any[] {
        try {
            const data = fs.readFileSync('brokers.json', 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    updateBrokersStorage(brokers: any[]): void {
        try {
            const data = JSON.stringify(brokers, null, 2);
            fs.writeFileSync('brokers.json', data, 'utf-8');
        } catch (error) {
            console.error(error);
        }
    }

    generateBrokerId() {
        const storage = this.getBrokers();
        return storage[storage.length - 1].id + 1;
    }

    addBroker(broker: any): void {
        const brokersStorage = this.getBrokers();
        brokersStorage.push(broker);
        this.updateBrokersStorage(brokersStorage);
    }

    deleteBroker(id: number): void {
        const brokersStorage = this.getBrokers();
        const updatedBrokers = brokersStorage.filter(broker => broker.id !== id);
        this.updateBrokersStorage(updatedBrokers);
    }

    updateBrokerBalance(id: number, updateBalance: number): void {
        const brokersStorage = this.getBrokers();
        const updatedBrokers = brokersStorage.map(broker => {
            if (broker.id === id) {
                return { ...broker, balance: updateBalance };
            }
            return broker;
        });
        this.updateBrokersStorage(updatedBrokers);
    }
}