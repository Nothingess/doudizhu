"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Card_1 = require("./Card");
var GameConst_1 = require("./GameConst");
/**发牌器 */
var Carder = /** @class */ (function () {
    function Carder() {
        this.mCardList = new Array();
        this.createCard();
        this.shuffleCard();
        this.deal();
    }
    //#region 初始化扑克
    /**实例化一副完整扑克 54 张 */
    Carder.prototype.createCard = function () {
        var val;
        var type;
        for (var cardVal in GameConst_1.CardVal) {
            val = parseInt(cardVal);
            if (!val)
                continue;
            //判断是否是王牌
            if (val >= GameConst_1.CardVal.SMALL) {
                this.mCardList.push(new Card_1.ICard(val));
                continue;
            }
            for (var cardType in GameConst_1.CardType) {
                type = parseInt(cardType);
                if (!type)
                    continue;
                this.mCardList.push(new Card_1.NormalCard(val, type));
            }
        }
    };
    /**洗牌 */
    Carder.prototype.shuffleCard = function () {
        var randomIndex;
        var tmpCard;
        for (var i = this.mCardList.length - 1; i >= 0; i--) {
            randomIndex = Math.floor(Math.random() * (i + 1));
            //随机交换
            tmpCard = this.mCardList[randomIndex];
            this.mCardList[randomIndex] = this.mCardList[i];
            this.mCardList[i] = tmpCard;
        }
    };
    /**发牌 */
    Carder.prototype.deal = function () {
        var list = [[], [], [], []]; //牌堆三分 + 三张底牌
        var index = 0;
        for (var i = 0; i < this.mCardList.length; i++) {
            if (i >= this.mCardList.length - 3) {
                list[3].push(this.mCardList[i]);
                continue;
            }
            list[index].push(this.mCardList[i]);
            index++;
            index %= list.length - 1;
        }
        return list;
    };
    //#endregion
    /*********************出牌类型，cardList已排序*************************** */
    //#region 牌型判断
    /**出一张牌 */
    Carder.isSingleCard = function (cardList) {
        return cardList.length === 1;
    };
    /**出一对 */
    Carder.isDoubleCard = function (cardList) {
        if (cardList.length !== 2)
            return false;
        if (cardList[0].isJoker()
            || cardList[0].getNumber() !== cardList[1].getNumber()) {
            return false;
        }
        return true;
    };
    /**三张不带 */
    Carder.isThree = function (cardList) {
        if (cardList.length !== 3)
            return false;
        if (cardList[0].getNumber() !== cardList[1].getNumber()
            || cardList[1].getNumber() !== cardList[2].getNumber()) {
            return false;
        }
        return true;
    };
    /**三带一 */
    Carder.isThreeAndOne = function (cardList) {
        if (cardList.length !== 4)
            return false;
        //炸弹
        if (cardList[0].getNumber() === cardList[1].getNumber()
            && cardList[1].getNumber() === cardList[2].getNumber()
            && cardList[2].getNumber() === cardList[3].getNumber()) {
            return false;
        }
        //单独那张在后面
        if (cardList[0].getNumber() === cardList[1].getNumber()
            && cardList[1].getNumber() === cardList[2].getNumber()) {
            return true;
        }
        //单独那张在前面
        if (cardList[1].getNumber() === cardList[2].getNumber()
            && cardList[2].getNumber() === cardList[3].getNumber()) {
            return true;
        }
        return false;
    };
    /**三带二 */
    Carder.IsThreeAndTwo = function (cardList) {
        if (cardList.length !== 5)
            return false;
        //一对在后面
        if (cardList[3].getNumber() === cardList[4].getNumber()
            && cardList[0].getNumber() === cardList[1].getNumber()
            && cardList[1].getNumber() === cardList[2].getNumber()) {
            return true;
        }
        //一对在前面
        if (cardList[0].getNumber() === cardList[1].getNumber()
            && cardList[2].getNumber() === cardList[3].getNumber()
            && cardList[3].getNumber() === cardList[4].getNumber()) {
            return true;
        }
        return false;
    };
    /**四张炸弹 */
    Carder.isBoom = function (cardList) {
        if (cardList.length !== 4)
            return false;
        if (cardList[0].getNumber() === cardList[1].getNumber()
            && cardList[1].getNumber() === cardList[2].getNumber()
            && cardList[2].getNumber() === cardList[3].getNumber()) {
            return true;
        }
        return false;
    };
    /**王炸 */
    Carder.isJokerBoom = function (cardList) {
        if (cardList.length !== 2)
            return false;
        if (cardList[0].isJoker() && cardList[1].isJoker())
            return true;
        return false;
    };
    /**飞机不带 */
    Carder.isPlannAndNone = function (cardList) {
        if (cardList.length < 6 || cardList.length > 21)
            return false;
        //方法一（对于已排序的 cardList）
        //判断是否相邻
        /*         if (cardList[3].getNumber() - cardList[2].getNumber() !== 1) return false;
                if (cardList[0].getNumber() === cardList[1].getNumber()
                    && cardList[1].getNumber() === cardList[2].getNumber()
                    && cardList[3].getNumber() === cardList[4].getNumber()
                    && cardList[4].getNumber() === cardList[5].getNumber()) {
                    return true;
                } */
        //方法二 （对于乱序的 cardList）
        //分类，相同数字的牌放一堆（如：333 444 两堆）
        /*         let map: Map<number, number> = new Map<number, number>();
                this.classify(map, cardList);
                //牌堆数量
                if (map.size !== 2) return false;
                let cardVal: Array<number> = [];
                map.forEach((v, k) => {//检测牌堆里有几张牌
                    if (v !== 3) return false;
                    cardVal.push(k);
                })
                //判断相邻
                if (Math.abs(cardVal[0] - cardVal[1]) !== 1) return false;
        
                return true; */
        //不能有2或者大小王
        for (var i = 0; i < cardList.length; i++) {
            if (cardList[i].getNumber() >= GameConst_1.CardVal.TWO) {
                return false;
            }
        }
        //分类
        var map = new Map();
        Carder.classify(map, cardList);
        map.forEach(function (v, k) { if (v !== 3)
            return false; });
        if (map.size < 2)
            return false;
        //判断是否是按顺序三重复的排序
        for (var j = 0; j < cardList.length - 3; j += 3) {
            if (cardList[j + 3].getNumber() - cardList[j].getNumber() !== 1)
                return false;
        }
        return true;
    };
    /**
     * 飞机带单
     *  ##所有可能
     *  @    333 444                         34     /     45     /     55      /    56
     *  @    333 444 555                     345    /     566    /     666     /    678
     *  @    333 444 555 666                 3456   /     6777   /     7777    /    789 10
     *  @    333 444 555 666 777             34567  /     78888  /     88889   /    89 10 J
     */
    Carder.isPlanAndsingle = function (cardList) {
        if (cardList.length < 8 || cardList.length > 20)
            return false;
        //分类，相同数字的牌放一堆
        var map = new Map();
        Carder.classify(map, cardList);
        var threeList = new Array(); //把所有三张的剔除到这里
        var otherList = new Array(); //把其他单张或者一对的剔除到这里
        map.forEach(function (v, k) {
            switch (v) {
                case 1:
                    otherList.push(k);
                    break;
                case 2:
                    otherList.push(k);
                    otherList.push(k);
                    break;
                case 3:
                    threeList.push(k);
                    break;
                case 4: //存在有炸弹，把炸弹拆开 如：3333拆成 333、3
                    otherList.push(k);
                    threeList.push(k);
                    break;
                default:
                    break;
            }
        });
        if (threeList.length < 2)
            return false; //三张的牌堆少于两堆，组不成飞机
        //判断三张的牌堆数是否大于单张数量，如果大于则需要
        //剔除一组三张牌堆作为带牌（最多只能剔除一堆，有手牌数上限决定）
        if (threeList.length > otherList.length) {
            console.log("threeList :" + threeList + "-otherList :" + otherList);
            //threeList可以看作是已排序的，所以只需要判断前后两端是否排好序
            var k = void 0;
            if (threeList[threeList.length - 1] - threeList[threeList.length - 2] !== 1) {
                k = threeList.pop();
                if (!!k) {
                    otherList.push(k);
                    otherList.push(k);
                    otherList.push(k);
                }
            }
            else {
                k = threeList.shift();
                if (!!k) {
                    otherList.push(k);
                    otherList.push(k);
                    otherList.push(k);
                }
            }
            console.log("cull element: " + k);
        }
        if (threeList.length !== otherList.length)
            return false; //三张牌堆数跟单张排数还是不相等
        //判断是否连续
        for (var i = 0; i < threeList.length - 1; i++) {
            if (threeList[i + 1] - threeList[i] !== 1)
                return false;
        }
        return true;
    };
    /**飞机带两对 */
    Carder.isPlanAndDouble = function (cardList) {
        if (cardList.length < 10 || cardList.length > 20)
            return false;
        //分类，相同数字的牌放一堆
        var map = new Map();
        Carder.classify(map, cardList);
        var threeList = new Array();
        var twoList = new Array();
        map.forEach(function (v, k) {
            switch (v) {
                case 2:
                    twoList.push(k);
                    break;
                case 3:
                    threeList.push(k);
                    break;
                case 4:
                    twoList.push(k);
                    twoList.push(k);
                    break;
                default:
                    break;
            }
        });
        if (threeList.length < 2 || threeList.length > 4)
            return false;
        if (threeList.length !== twoList.length)
            return false;
        //判断三张牌的牌堆是否连续
        for (var i = 0; i < threeList.length - 1; i++) {
            if (threeList[i + 1] - threeList[i] !== 1)
                return false;
        }
        return true;
    };
    /**顺子 */
    Carder.isStraight = function (cardList) {
        if (cardList.length < 5 || cardList.length > 12)
            return false;
        //不能有2或者大小王
        for (var i = 0; i < cardList.length; i++) {
            if (cardList[i].getNumber() >= GameConst_1.CardVal.TWO) {
                return false;
            }
        }
        //判断是否是按顺序无重复的排序
        for (var j = 0; j < cardList.length - 1; j++) {
            if (cardList[j + 1].getNumber() - cardList[j].getNumber() !== 1)
                return false;
        }
        return true;
    };
    /**连对 */
    Carder.isLianDui = function (cardList) {
        if (cardList.length < 6 || cardList.length > 24)
            return false;
        //不能有2或者大小王
        for (var i = 0; i < cardList.length; i++) {
            if (cardList[i].getNumber() >= GameConst_1.CardVal.TWO) {
                return false;
            }
        }
        //分类，相同数字的牌放一堆
        var map = new Map();
        Carder.classify(map, cardList);
        //相同牌面（数字）的牌只能是两张
        map.forEach(function (v, k) { if (v !== 2)
            return false; });
        if (map.size < 3)
            return false;
        //判断是否是按顺序无重复的排序
        for (var j = 0; j < cardList.length - 2; j += 2) {
            if (cardList[j + 2].getNumber() - cardList[j].getNumber() !== 1)
                return false;
        }
        return true;
    };
    //#endregion
    /**********牌面比较，cardList已排序，这一步无需检测牌型是否正确*********** */
    //#region 牌面比较
    /**
     * 单张牌比较牌面大小
     * @param cardListA 上次的出牌
     * @param cardListB 当前的出牌
     */
    Carder.compareSingle = function (cardListA, cardListB) {
        return cardListB[0].getNumber() > cardListA[0].getNumber();
    };
    /**比较一对 */
    Carder.compareDouble = function (cardListA, cardListB) {
        return Carder.compareSingle(cardListA, cardListB);
    };
    /**比较三张不带 */
    Carder.compareThree = function (cardListA, cardListB) {
        return Carder.compareSingle(cardListA, cardListB);
    };
    /**比较三带一， 由于cardList已排序，所以判断中间元素大小即可 */
    Carder.compareThreeAndOne = function (cardListA, cardListB) {
        return cardListB[1].getNumber() > cardListA[1].getNumber();
    };
    /**比较三带二，由于cardList已排序，所以判断中间元素大小即可 */
    Carder.compareThreeAndTwo = function (cardListA, cardListB) {
        return cardListB[2].getNumber() > cardListA[2].getNumber();
    };
    /**比较普通炸弹 */
    Carder.compareBoom = function (cardListA, cardListB) {
        return Carder.compareSingle(cardListA, cardListB);
    };
    /**比较王炸 */
    Carder.compareJokerBoom = function (cardListA, cardListB) {
        return true;
    };
    /**比较飞机（不带） */
    Carder.comparePlan = function (cardListA, cardListB) {
        if (cardListB.length !== cardListA.length)
            return false;
        if (cardListB[cardListB.length - 1].getNumber() <=
            cardListA[cardListA.length - 1].getNumber())
            return false;
        return true;
    };
    /**比较飞机带单 */
    Carder.comparePlanAndOne = function (cardListA, cardListB) {
        if (cardListB.length !== cardListA.length)
            return false;
        //todo
        //分类，相同数字的牌放一堆
        var maxA = Carder.getPlanAndOneMax(cardListA);
        var maxB = Carder.getPlanAndOneMax(cardListB);
        return maxB > maxA;
    };
    /**比较飞机带双 */
    Carder.comparePlanAndTwo = function (cardListA, cardListB) {
        if (cardListB.length !== cardListA.length)
            return false;
        //todo
        //分类，相同数字的牌放一堆
        var maxA = Carder.getPlanAndTwoMax(cardListA);
        var maxB = Carder.getPlanAndTwoMax(cardListB);
        return maxB > maxA;
    };
    /**比较顺子 */
    Carder.compareStraight = function (cardListA, cardListB) {
        if (cardListB.length !== cardListA.length)
            return false;
        if (cardListB[cardListB.length - 1].getNumber() <=
            cardListA[cardListA.length - 1].getNumber())
            return false;
        return true;
    };
    /**比较连对 */
    Carder.compareLianDui = function (cardListA, cardListB) {
        return Carder.compareStraight(cardListA, cardListB);
    };
    /**比较牌面大小 */
    Carder.compareWithPlayCards = function (cardListA, cardListB) {
        var typeA = Carder.getPlayCardType(cardListA);
        var typeB = Carder.getPlayCardType(cardListB);
        if (typeA === typeB) {
            return Carder.comparePlayCards(cardListA, cardListB, typeA);
        }
        var valA = GameConst_1.getPlayCardValue(typeA);
        var valB = GameConst_1.getPlayCardValue(typeB);
        return valB > valA;
    };
    /**
     * 比较出牌（牌型类型相同的情况下的比较）
     * @param cardListA 上次的出牌
     * @param cardListB 当前的出牌
     * @param type 比较的牌型
     */
    Carder.comparePlayCards = function (cardListA, cardListB, type) {
        var res;
        switch (type) {
            case GameConst_1.PlayCardType.SINGLE:
                res = Carder.compareSingle(cardListA, cardListB);
                break;
            case GameConst_1.PlayCardType.DOUBLE:
                res = Carder.compareDouble(cardListA, cardListB);
                break;
            case GameConst_1.PlayCardType.THREE:
                res = Carder.compareThree(cardListA, cardListB);
                break;
            case GameConst_1.PlayCardType.THREE_AND_ONE:
                res = Carder.compareThreeAndOne(cardListA, cardListB);
                break;
            case GameConst_1.PlayCardType.THREE_AND_TWO:
                res = Carder.compareThreeAndTwo(cardListA, cardListB);
                break;
            case GameConst_1.PlayCardType.BOOM:
                res = Carder.compareBoom(cardListA, cardListB);
                break;
            case GameConst_1.PlayCardType.JOKER_BOOM:
                res = Carder.compareJokerBoom(cardListA, cardListB);
                break;
            case GameConst_1.PlayCardType.PLAN:
                res = Carder.comparePlan(cardListA, cardListB);
                break;
            case GameConst_1.PlayCardType.PLAN_AND_ONO:
                res = Carder.comparePlanAndOne(cardListA, cardListB);
                break;
            case GameConst_1.PlayCardType.PLAN_ADN_TWO:
                res = Carder.comparePlanAndTwo(cardListA, cardListB);
                break;
            case GameConst_1.PlayCardType.STRAIGHT:
                res = Carder.compareStraight(cardListA, cardListB);
                break;
            case GameConst_1.PlayCardType.LIAN_DUI:
                res = Carder.compareLianDui(cardListA, cardListB);
                break;
            default:
                res = false;
                break;
        }
        return res;
    };
    /**#获取飞机带单主牌最大值
     * #主牌：如飞机 333 444 56 ，其中333 444 是主牌
     * #最大值则为 4
     */
    Carder.getPlanAndOneMax = function (cardList) {
        var map = new Map();
        Carder.classify(map, cardList);
        var threeList = new Array(); //把所有三张的剔除到这里
        var otherList = new Array(); //把其他单张或者一对的剔除到这里
        map.forEach(function (v, k) {
            switch (v) {
                case 1:
                    otherList.push(k);
                    break;
                case 2:
                    otherList.push(k);
                    otherList.push(k);
                    break;
                case 3:
                    threeList.push(k);
                    break;
                case 4: //存在有炸弹，把炸弹拆开 如：3333拆成 333、3
                    otherList.push(k);
                    threeList.push(k);
                    break;
                default:
                    break;
            }
        });
        //判断三张的牌堆数是否大于单张数量，如果大于则需要
        //剔除一组三张牌堆作为带牌（最多只能剔除一堆，有手牌数上限决定）
        if (threeList.length > otherList.length) {
            //threeList是已排序的，所以只需要判断前后两端是否排好序
            var k = void 0;
            if (threeList[threeList.length - 1] - threeList[threeList.length - 2] !== 1) {
                k = threeList.pop();
                if (!!k) {
                    otherList.push(k);
                    otherList.push(k);
                    otherList.push(k);
                }
            }
            else {
                k = threeList.shift();
                if (!!k) {
                    otherList.push(k);
                    otherList.push(k);
                    otherList.push(k);
                }
            }
        }
        return threeList[threeList.length - 1];
    };
    /**获取飞机带双主牌最大值 */
    Carder.getPlanAndTwoMax = function (cardList) {
        //分类，相同数字的牌放一堆
        var map = new Map();
        Carder.classify(map, cardList);
        var threeList = new Array();
        map.forEach(function (v, k) {
            if (v === 3) {
                threeList.push(k);
            }
        });
        return threeList[threeList.length - 1];
    };
    //#endregion
    /**分类，相同数字的牌放一堆 */
    Carder.classify = function (map, cardList) {
        for (var i = 0; i < cardList.length; i++) {
            var val = map.get(cardList[i].getNumber());
            if (!!val) {
                val++;
                map.set(cardList[i].getNumber(), val);
            }
            else {
                map.set(cardList[i].getNumber(), 1);
            }
        }
    };
    /**获取出牌类型 */
    Carder.getPlayCardType = function (cardList) {
        if (Carder.isSingleCard(cardList))
            return GameConst_1.PlayCardType.SINGLE;
        if (Carder.isDoubleCard(cardList))
            return GameConst_1.PlayCardType.DOUBLE;
        if (Carder.isThree(cardList))
            return GameConst_1.PlayCardType.THREE;
        if (Carder.isThreeAndOne(cardList))
            return GameConst_1.PlayCardType.THREE_AND_ONE;
        if (Carder.IsThreeAndTwo(cardList))
            return GameConst_1.PlayCardType.THREE_AND_TWO;
        if (Carder.isBoom(cardList))
            return GameConst_1.PlayCardType.BOOM;
        if (Carder.isJokerBoom(cardList))
            return GameConst_1.PlayCardType.JOKER_BOOM;
        if (Carder.isPlannAndNone(cardList))
            return GameConst_1.PlayCardType.PLAN;
        if (Carder.isPlanAndsingle(cardList))
            return GameConst_1.PlayCardType.PLAN_AND_ONO;
        if (Carder.isPlanAndDouble(cardList))
            return GameConst_1.PlayCardType.PLAN_ADN_TWO;
        if (Carder.isStraight(cardList))
            return GameConst_1.PlayCardType.STRAIGHT;
        if (Carder.isLianDui(cardList))
            return GameConst_1.PlayCardType.LIAN_DUI;
        return GameConst_1.PlayCardType.NONE;
    };
    return Carder;
}());
exports.Carder = Carder;
var carder = new Carder();
