"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var ClientMgr_1 = require("./ClientMgr");
var config = {
    port: 3000
};
var Serv = /** @class */ (function () {
    function Serv() {
        try {
            this.wss = new WebSocket.Server(config);
        }
        catch (error) {
            console.error("create server err : " + error);
        }
        this.mClientMgr = new ClientMgr_1.ClientMgr();
    }
    /**开启服务端 */
    Serv.prototype.start = function () {
        if (!this.wss)
            return;
        this.wss.on('connection', this.onConnection.bind(this));
        this.wss.on('error', this.onError.bind(this));
    };
    //····························回调事件·································//
    /**有新客户端连接进来 */
    Serv.prototype.onConnection = function (ws, require) {
        if (!this.mClientMgr)
            return;
        console.log('有新客户端连接进来');
        this.mClientMgr.newClient(ws);
    };
    Serv.prototype.onError = function (err) {
        console.error("server error : " + err);
    };
    return Serv;
}());
var server = new Serv();
server.start();
