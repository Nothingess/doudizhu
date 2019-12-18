import WebSocket = require("ws");
import { ClientMgr } from "./ClientMgr";

/**玩家连接服务器进行登录后实例的对象（网络层） */
export class Client {
    private mClientMgr: ClientMgr;
    private mSocket: WebSocket;

    constructor(mgr: ClientMgr, socket: WebSocket) {
        this.mClientMgr = mgr;
        this.mSocket = socket;
        this.initSocket();
    }

    private initSocket(): void {
        this.mSocket.on('open', this.onOpen.bind(this));
        this.mSocket.on('message', this.onMessage.bind(this));
        this.mSocket.on('close', this.onClose.bind(this));
        this.mSocket.on('error', this.onError.bind(this));
    }

    //····························回调事件·································//
    private onOpen(): void {
        console.log(`client on open !`);
    }
    private onMessage(data: WebSocket.Data): void {
        console.log(`received client message : ${data}`);
        this.mClientMgr.broadcast(data);
    }
    private onClose(code: number, reason: string): void {
        console.log(`close socket : code[${code}] - reason[${reason}]`);
    }
    private onError(err: Error): void {
        console.error(`client err : ${err}`);
    }


    //····························operation·································//
    public send(message: WebSocket.Data): void {
        this.mSocket.send(message);
    }
}