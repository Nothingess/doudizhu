import { Client } from "./Client";
import WebSocket = require("ws");

export class ClientMgr {

    private mMaxClients: number = 50;
    private mClients: Array<Client>;

    constructor() {
        this.mClients = new Array<Client>();
    }

    /**新连接 */
    public newClient(ws: WebSocket): void {
        if (this.mClients.length >= this.mMaxClients) return;
        let client: Client = new Client(this, ws);
        this.mClients.push(client);
    }
    public removeClient(client: Client): void {
        let index: number = this.mClients.indexOf(client);
        if (index < 0) return;

        this.mClients.splice(index, 1);
    }

    public broadcast(message: WebSocket.Data): void {
        this.mClients.forEach(client => {
            client.send(message);
        })
    }


}