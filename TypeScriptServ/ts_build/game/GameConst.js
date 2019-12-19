"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**客户端请求命令 */
var NetCMD;
(function (NetCMD) {
    /**登陆 */
    NetCMD[NetCMD["login_in"] = 1] = "login_in";
    /**注册 */
    NetCMD[NetCMD["register"] = 2] = "register";
    //处于大厅中
    /**发送世界聊天 */
    NetCMD[NetCMD["chat_to_world"] = 3] = "chat_to_world";
    /**发送好友聊天 */
    NetCMD[NetCMD["chat_to_friend"] = 4] = "chat_to_friend";
    /**发送好友请求 */
    NetCMD[NetCMD["add_firend"] = 5] = "add_firend";
    /**删除好友 */
    NetCMD[NetCMD["remove_friend"] = 6] = "remove_friend";
    /**拉取好友列表 */
    NetCMD[NetCMD["pull_friend_info"] = 7] = "pull_friend_info";
    /**获取玩家信息 */
    NetCMD[NetCMD["get_player_info"] = 8] = "get_player_info";
    /**获取房间列表 */
    NetCMD[NetCMD["pull_room_list"] = 9] = "pull_room_list";
    /**申请加入房间 */
    NetCMD[NetCMD["req_room"] = 10] = "req_room";
    //处于对局游戏中
})(NetCMD = exports.NetCMD || (exports.NetCMD = {}));
/**纸牌花色 */
var CardType;
(function (CardType) {
    /**方块 */
    CardType[CardType["BRICK"] = 1] = "BRICK";
    /**梅花 */
    CardType[CardType["PLUM"] = 2] = "PLUM";
    /**红桃 */
    CardType[CardType["HEARTS"] = 3] = "HEARTS";
    /**黑桃 */
    CardType[CardType["SPADE"] = 4] = "SPADE";
})(CardType = exports.CardType || (exports.CardType = {}));
/**牌面大小 */
var CardVal;
(function (CardVal) {
    CardVal[CardVal["THREE"] = 1] = "THREE";
    CardVal[CardVal["FOUR"] = 2] = "FOUR";
    CardVal[CardVal["FIVE"] = 3] = "FIVE";
    CardVal[CardVal["SIX"] = 4] = "SIX";
    CardVal[CardVal["SEVEN"] = 5] = "SEVEN";
    CardVal[CardVal["EIGHT"] = 6] = "EIGHT";
    CardVal[CardVal["NINE"] = 7] = "NINE";
    CardVal[CardVal["TEN"] = 8] = "TEN";
    CardVal[CardVal["J"] = 9] = "J";
    CardVal[CardVal["Q"] = 10] = "Q";
    CardVal[CardVal["K"] = 11] = "K";
    CardVal[CardVal["A"] = 12] = "A";
    CardVal[CardVal["TWO"] = 13] = "TWO";
    /**小王 */
    CardVal[CardVal["SMALL"] = 14] = "SMALL";
    /**大王 */
    CardVal[CardVal["BIG"] = 15] = "BIG";
})(CardVal = exports.CardVal || (exports.CardVal = {}));
/**出牌类型 */
var PlayCardType;
(function (PlayCardType) {
    /**无类型，属于不能出的牌型 */
    PlayCardType[PlayCardType["NONE"] = 0] = "NONE";
    /**单张 */
    PlayCardType[PlayCardType["SINGLE"] = 1] = "SINGLE";
    /**一对 */
    PlayCardType[PlayCardType["DOUBLE"] = 2] = "DOUBLE";
    /**三张不带 */
    PlayCardType[PlayCardType["THREE"] = 3] = "THREE";
    /**三带一 */
    PlayCardType[PlayCardType["THREE_AND_ONE"] = 4] = "THREE_AND_ONE";
    /**三带二 */
    PlayCardType[PlayCardType["THREE_AND_TWO"] = 5] = "THREE_AND_TWO";
    /**普通炸弹 */
    PlayCardType[PlayCardType["BOOM"] = 6] = "BOOM";
    /**王炸 */
    PlayCardType[PlayCardType["JOKER_BOOM"] = 7] = "JOKER_BOOM";
    /**飞机 */
    PlayCardType[PlayCardType["PLAN"] = 8] = "PLAN";
    /**飞机带单 */
    PlayCardType[PlayCardType["PLAN_AND_ONO"] = 9] = "PLAN_AND_ONO";
    /**飞机带对 */
    PlayCardType[PlayCardType["PLAN_ADN_TWO"] = 10] = "PLAN_ADN_TWO";
    /**顺子 */
    PlayCardType[PlayCardType["STRAIGHT"] = 11] = "STRAIGHT";
    /**连对（双顺） */
    PlayCardType[PlayCardType["LIAN_DUI"] = 12] = "LIAN_DUI";
})(PlayCardType = exports.PlayCardType || (exports.PlayCardType = {}));
//#region PlayCardValue
/**
 * 出牌类型之间大小数值的定义
 * ## value值大的可以打value小的牌
 * ## 如果value一样大，则判断牌型，牌型一样再判断大小
 */
var PlayCardValue = new Map();
PlayCardValue.set(PlayCardType.SINGLE, 1);
PlayCardValue.set(PlayCardType.DOUBLE, 1);
PlayCardValue.set(PlayCardType.THREE, 1);
PlayCardValue.set(PlayCardType.THREE_AND_ONE, 1);
PlayCardValue.set(PlayCardType.THREE_AND_TWO, 1);
PlayCardValue.set(PlayCardType.BOOM, 2);
PlayCardValue.set(PlayCardType.JOKER_BOOM, 3);
PlayCardValue.set(PlayCardType.PLAN, 1);
PlayCardValue.set(PlayCardType.PLAN_AND_ONO, 1);
PlayCardValue.set(PlayCardType.PLAN_ADN_TWO, 1);
PlayCardValue.set(PlayCardType.STRAIGHT, 1);
PlayCardValue.set(PlayCardType.LIAN_DUI, 1);
/**通过PlayCardType获取牌面值大小 */
function getPlayCardValue(playCardType) {
    var val = PlayCardValue.get(playCardType);
    if (!!val)
        return val;
    return -1;
}
exports.getPlayCardValue = getPlayCardValue;
//#endregion
