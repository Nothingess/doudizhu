import WebSocket = require("ws");
import { IncomingMessage } from "http";
import { ClientMgr } from "./ClientMgr";

let config: WebSocket.ServerOptions = {
    port: 3000
}

class Serv {
    private wss: WebSocket.Server | undefined;
    private mClientMgr: ClientMgr | undefined;

    constructor() {
        try {
            this.wss = new WebSocket.Server(config);
        } catch (error) {
            console.error(`create server err : ${error}`);
        }
        this.mClientMgr = new ClientMgr();
    }

    /**开启服务端 */
    public start(): void {
        if (!this.wss) return;
        this.wss.on('connection', this.onConnection.bind(this));
        this.wss.on('error', this.onError.bind(this));
    }

    //····························回调事件·································//
    /**有新客户端连接进来 */
    private onConnection(ws: WebSocket, require: IncomingMessage): void {
        if (!this.mClientMgr) return;
        console.log('有新客户端连接进来');
        this.mClientMgr.newClient(ws);
    }
    private onError(err: Error): void {
        console.error(`server error : ${err}`);
    }
}

let server: Serv = new Serv();
server.start();


