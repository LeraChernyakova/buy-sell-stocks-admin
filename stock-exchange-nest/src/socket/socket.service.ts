import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway
} from "@nestjs/websockets";


@WebSocketGateway({cors: {origin:"*"}})
export class SocketService implements OnGatewayConnection{
    private index: number = 0;
    private interval: any;
    private wsClients: any[] = [];
    private list: any[] = [];

    handleConnection(client: any) {
        if (!this.wsClients.includes(client)){
            console.log("connection");
            this.wsClients.push(client);
        }
    }

    handleDisconnect(client: any) {
        for (let i = 0; i < this.wsClients.length; i++) {
            if (this.wsClients[i] === client) {
                console.log("disconnection");
                this.wsClients.splice(i, 1);
                break;
            }
        }
    }

    private broadcast(event: string, message: any) {
        const broadCastMessage = JSON.stringify(message);
        for (let client of this.wsClients) {
            client.emit(event, broadCastMessage);
        }
    }

    @SubscribeMessage("tradingDone")
    handleTradingListEvent(@MessageBody() dto: any, @ConnectedSocket() client: any){
        this.list = dto
        this.broadcast('tradingList', dto);
    }

    @SubscribeMessage("startTrading")
    handleStartEvent(@MessageBody() dto: any, @ConnectedSocket() client: any){
        this.index = Number(dto.index);
        const res = {type: "send", dto}
        this.interval = setInterval(()=>{
            this.broadcast('tradingList', this.list);
            this.broadcast('trading', this.index);
            this.index += 1;
        }, 1000*dto.speed);
    }

    @SubscribeMessage("stopTrading")
    handleStopEvent(@MessageBody() dto: any, @ConnectedSocket() client: any){
        clearInterval(this.interval)
        console.log("stop")
        this.index = 0
    }
}