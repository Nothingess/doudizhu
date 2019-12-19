"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**玩家登录后进入主页面实例的玩家对象（游戏层） */
var Player = /** @class */ (function () {
    function Player(client, info) {
        this.mClient = client;
        this.mInfo = info;
    }
    Player.prototype.send = function (message) {
        this.mClient.send(message);
    };
    return Player;
}());
exports.Player = Player;
/**开局游戏（玩家加入房间后实例的游戏对象） */
var GamePlay = /** @class */ (function () {
    function GamePlay(player, room, index) {
        this.mPlayer = player;
        this.mRoom = room;
        this.mIsReady = false;
        this.mSeatIndex = index;
        this.mCards = new Array();
    }
    GamePlay.prototype.send = function (message) {
        this.mPlayer.send(message);
    };
    return GamePlay;
}());
exports.GamePlay = GamePlay;
