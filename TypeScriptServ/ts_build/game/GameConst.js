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
