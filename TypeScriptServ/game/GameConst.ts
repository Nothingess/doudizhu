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
//牌型之间大小数值的定义
const CardsValue = {
    one: {
        name: 'One',
        value: 1
    },
    double: {
        name: 'Double',
        value: 1
    },
    three: {
        name: 'Three',
        value: 1
    },
    boom: { //炸弹
        name: 'Boom',
        value: 2
    },
    threeAndOne: {
        name: 'ThreeAndOne',
        value: 1
    },
    threeAndTwo: {
        name: 'ThreeAndTwo',
        value: 1
    },
    plane: {
        name: 'Plane',
        value: 1
    },
    planeAndOne: {
        name: 'PlaneAndOne',
        value: 1
    },
    planeAndTwo: {
        name: 'PlaneAndTwo',
        value: 1
    },
    straight: { //顺子
        name: 'Straight',
        value: 1
    },
    lianDui: {  //连对
        name: 'LianDui',
        value: 1
    },
    jokerboom: { //王炸
        name: 'Jokerboom',
        value: 3
    }
};


