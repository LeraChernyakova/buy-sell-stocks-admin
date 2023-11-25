import * as socketIo from 'socket.io-client';
import { useEffect } from "react";


const SERVER_ERL = "http://localhost:8080";


export class SocketIo{
    static socket  = null
    static connection() {
        this.socket = socketIo.connect(SERVER_ERL);

        this.socket.on('connect', ()=>{
            console.log("connected")
        });

        this.socket.on('disconnect', ()=>{
            console.log("disconnect")
        });
    }
}



export const useConnectSocket = () => {
    const socketConnect = ()=>{
        SocketIo.connection();
    }

    useEffect(()=>{
        socketConnect()
    },[])
}