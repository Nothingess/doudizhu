"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var GameConst_1 = require("../game/GameConst");
var IHandle = /** @class */ (function () {
    function IHandle() {
        this.mInterestCMD = new Map();
    }
    /**
     * 监听感兴趣的命令
     * @param cmd 命令
     * @param handle 执行函数
     */
    IHandle.prototype.addInterestCMD = function (cmd, handle) {
        if (!!this.mInterestCMD.get(cmd))
            return;
        this.mInterestCMD.set(cmd, handle);
    };
    /**移除监听的某个命令 */
    IHandle.prototype.removeInterestCMD = function (cmd) {
        if (!this.mInterestCMD.get(cmd))
            return;
        this.mInterestCMD.delete(cmd);
    };
    /**执行命令
     * 如果命令不存在放回 -1
     */
    IHandle.prototype.executeCMD = function (cmd, target, arg) {
        var handle = this.mInterestCMD.get(cmd);
        if (!handle) {
            var response = {
                cmd: GameConst_1.NetCMD.login_in,
                res: -1,
                data: null
            };
            target.send(JSON.stringify(response));
            return;
        }
        handle(target, arg);
    };
    return IHandle;
}());
exports.IHandle = IHandle;
/**处理玩家登陆消息 */
var HandleLoginMsg = /** @class */ (function (_super) {
    __extends(HandleLoginMsg, _super);
    function HandleLoginMsg() {
        var _this = _super.call(this) || this;
        _this.addInterestCMD(GameConst_1.NetCMD.login_in, _this.loginIn.bind(_this));
        _this.addInterestCMD(GameConst_1.NetCMD.register, _this.register.bind(_this));
        return _this;
    }
    /**用户登陆 */
    HandleLoginMsg.prototype.loginIn = function (client, arg) {
        //TODO
        //查询用户信息
        //存在，返回登陆成功
        //不存在，放回登陆失败
    };
    /**用户注册 */
    HandleLoginMsg.prototype.register = function (client, arg) {
    };
    return HandleLoginMsg;
}(IHandle));
exports.HandleLoginMsg = HandleLoginMsg;
/**处理玩家大厅消息 */
var HandleLobbyMsg = /** @class */ (function (_super) {
    __extends(HandleLobbyMsg, _super);
    function HandleLobbyMsg() {
        var _this = _super.call(this) || this;
        _this.addInterestCMD(GameConst_1.NetCMD.chat_to_world, _this.chatToWorld.bind(_this));
        _this.addInterestCMD(GameConst_1.NetCMD.chat_to_friend, _this.chatToFriend.bind(_this));
        _this.addInterestCMD(GameConst_1.NetCMD.add_firend, _this.addFriend.bind(_this));
        _this.addInterestCMD(GameConst_1.NetCMD.remove_friend, _this.removeFriend.bind(_this));
        _this.addInterestCMD(GameConst_1.NetCMD.pull_friend_info, _this.pullFiriendInfo.bind(_this));
        _this.addInterestCMD(GameConst_1.NetCMD.get_player_info, _this.getPlayerInfo.bind(_this));
        _this.addInterestCMD(GameConst_1.NetCMD.pull_room_list, _this.pullRoomList.bind(_this));
        _this.addInterestCMD(GameConst_1.NetCMD.req_room, _this.requestRoom.bind(_this));
        return _this;
    }
    /**世界频道聊天 */
    HandleLobbyMsg.prototype.chatToWorld = function (player, arg) {
    };
    /**好友聊天 */
    HandleLobbyMsg.prototype.chatToFriend = function (player, arg) {
    };
    /**添加好友 */
    HandleLobbyMsg.prototype.addFriend = function (player, arg) {
    };
    /**删除好友 */
    HandleLobbyMsg.prototype.removeFriend = function (player, arg) {
    };
    /**拉取好友列表 */
    HandleLobbyMsg.prototype.pullFiriendInfo = function (player, arg) {
    };
    /**获取玩家信息 */
    HandleLobbyMsg.prototype.getPlayerInfo = function (player, arg) {
    };
    /**获取房间列表 */
    HandleLobbyMsg.prototype.pullRoomList = function (player, arg) {
    };
    /**申请加入房间 */
    HandleLobbyMsg.prototype.requestRoom = function (player, arg) {
    };
    return HandleLobbyMsg;
}(IHandle));
exports.HandleLobbyMsg = HandleLobbyMsg;
/**处理玩家开局游戏中的消息 */
var HandlePlayerMsg = /** @class */ (function (_super) {
    __extends(HandlePlayerMsg, _super);
    function HandlePlayerMsg() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HandlePlayerMsg;
}(IHandle));
exports.HandlePlayerMsg = HandlePlayerMsg;
