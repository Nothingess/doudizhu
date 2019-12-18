/**玩家数据 */
export interface PlayerInfo {
    nickName: string,       //昵称
    accountID: number,      //账号
    avatarUrl: string,      //头像地址
    gold: number            //金币数
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



