"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//牌型之间大小数值的定义
var CardsValue = {
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
    boom: {
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
    straight: {
        name: 'Straight',
        value: 1
    },
    lianDui: {
        name: 'LianDui',
        value: 1
    },
    jokerboom: {
        name: 'Jokerboom',
        value: 3
    }
};
