"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Client_1 = require("./Client");
var ClientMgr = /** @class */ (function () {
    function ClientMgr() {
        this.mMaxClients = 50;
        this.mClients = new Array();
    }
    /**新连接 */
    ClientMgr.prototype.newClient = function (ws) {
        if (this.mClients.length >= this.mMaxClients)
            return;
        var client = new Client_1.Client(this, ws);
        this.mClients.push(client);
    };
    ClientMgr.prototype.removeClient = function (client) {
        var index = this.mClients.indexOf(client);
        if (index < 0)
            return;
        this.mClients.splice(index, 1);
    };
    ClientMgr.prototype.broadcast = function (message) {
        this.mClients.forEach(function (client) {
            client.send(message);
        });
    };
    return ClientMgr;
}());
exports.ClientMgr = ClientMgr;
