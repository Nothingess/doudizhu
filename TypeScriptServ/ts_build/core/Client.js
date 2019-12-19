"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**玩家连接服务器进行登录后实例的对象（网络层） */
var Client = /** @class */ (function () {
    function Client(mgr, socket) {
        this.mClientMgr = mgr;
        this.mSocket = socket;
        this.initSocket();
    }
    Client.prototype.initSocket = function () {
        this.mSocket.on('open', this.onOpen.bind(this));
        this.mSocket.on('message', this.onMessage.bind(this));
        this.mSocket.on('close', this.onClose.bind(this));
        this.mSocket.on('error', this.onError.bind(this));
    };
    //····························回调事件·································//
    Client.prototype.onOpen = function () {
        console.log("client on open !");
    };
    Client.prototype.onMessage = function (data) {
        console.log("received client message : " + data);
        this.mClientMgr.broadcast(data);
    };
    Client.prototype.onClose = function (code, reason) {
        console.log("close socket : code[" + code + "] - reason[" + reason + "]");
    };
    Client.prototype.onError = function (err) {
        console.error("client err : " + err);
    };
    //····························operation·································//
    Client.prototype.send = function (message) {
        this.mSocket.send(message);
    };
    return Client;
}());
exports.Client = Client;
