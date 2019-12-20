/**服务端响应内容 */
export interface ServRes {
    cmd: NetCMD,    //响应命令
    /**
     * 响应结果
     * #-1：请求命令不存在
     * #0：请求失败
     * #1：请求成功
     */
    code: number,
    data?: any       //返回数据
}
/**操作数据库返回的内容 */
export interface DBRes {
    /**
     * 响应结果
     * #-1：查询错误代码
     * #0：查询的东西不存在
     * #1：查询成功
     */
    code: number,
    data?: any
}
/**玩家数据 */
export interface PlayerInfo {
    nickName: string,       //昵称
    accountID: number,      //账号
    avatarUrl: string,      //头像地址
    gold: number            //金币数
}


/**通过接口申明函数类型 */
export interface dbCallBack { (dbRes: DBRes): void }

/**客户端请求命令 */
export enum NetCMD {
    /**登陆 */
    login_in = 1,
    /**注册 */
    register,

    //处于大厅中
    /**发送世界聊天 */
    chat_to_world,
    /**发送好友聊天 */
    chat_to_friend,
    /**发送好友请求 */
    add_firend,
    /**删除好友 */
    remove_friend,
    /**拉取好友列表 */
    pull_friend_info,
    /**获取玩家信息 */
    get_player_info,
    /**获取房间列表 */
    pull_room_list,
    /**申请加入房间 */
    req_room

    //处于对局游戏中


}
/**纸牌花色 */
export enum CardType {
    /**方块 */
    BRICK = 1,
    /**梅花 */
    PLUM,
    /**红桃 */
    HEARTS,
    /**黑桃 */
    SPADE
}
/**牌面大小 */
export enum CardVal {
    THREE = 1,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NINE,
    TEN,
    J,
    Q,
    K,
    A,
    TWO,
    /**小王 */
    SMALL,
    /**大王 */
    BIG
}
/**出牌类型 */
export enum PlayCardType {
    /**无类型，属于不能出的牌型 */
    NONE = 0,
    /**单张 */
    SINGLE,
    /**一对 */
    DOUBLE,
    /**三张不带 */
    THREE,
    /**三带一 */
    THREE_AND_ONE,
    /**三带二 */
    THREE_AND_TWO,
    /**普通炸弹 */
    BOOM,
    /**王炸 */
    JOKER_BOOM,
    /**飞机 */
    PLAN,
    /**飞机带单 */
    PLAN_AND_ONO,
    /**飞机带对 */
    PLAN_ADN_TWO,
    /**顺子 */
    STRAIGHT,
    /**连对（双顺） */
    LIAN_DUI
}
//#region PlayCardValue
/**
 * 出牌类型之间大小数值的定义
 * ## value值大的可以打value小的牌
 * ## 如果value一样大，则判断牌型，牌型一样再判断大小
 */
const PlayCardValue: Map<PlayCardType, number> = new Map<PlayCardType, number>();
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
export function getPlayCardValue(playCardType: PlayCardType): number {
    let val: number | undefined = PlayCardValue.get(playCardType);
    if (!!val) return val;
    return -1;
}
//#endregion



