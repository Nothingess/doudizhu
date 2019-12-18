"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Card_1 = require("./Card");
var GameConst_1 = require("./GameConst");
var Carder = /** @class */ (function () {
    function Carder() {
        this.mCardList = new Array();
        this.createCard();
        this.shuffleCard();
        this.deal();
    }
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
    /**********出牌类型，cardList已排序*********** */
    /**出一张牌 */
    Carder.prototype.isSingleCard = function (cardList) {
        return cardList.length === 1;
    };
    /**出一对 */
    Carder.prototype.isDoubleCard = function (cardList) {
        if (cardList.length !== 2)
            return false;
        if (cardList[0].isJoker()
            || cardList[0].getNumber() !== cardList[1].getNumber()) {
            return false;
        }
        return true;
    };
    /**三张不带 */
    Carder.prototype.isThree = function (cardList) {
        if (cardList.length !== 3)
            return false;
        if (cardList[0].getNumber() !== cardList[1].getNumber()
            || cardList[1].getNumber() !== cardList[2].getNumber()) {
            return false;
        }
        return true;
    };
    /**三带一 */
    Carder.prototype.isThreeAndOne = function (cardList) {
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
    Carder.prototype.IsThreeAndTwo = function (cardList) {
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
    Carder.prototype.isBoom = function (cardList) {
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
    Carder.prototype.isJokerBoom = function (cardList) {
        if (cardList.length !== 2)
            return false;
        if (cardList[0].isJoker() && cardList[1].isJoker())
            return true;
        return false;
    };
    /**飞机不带 */
    Carder.prototype.isPlannAndNone = function (cardList) {
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
        this.classify(map, cardList);
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
     *      333 444                         34          45          55          56
     *      333 444 555                     345         566         666         678
     *      333 444 555 666                 3456        6777        7777        789 10
     *      333 444 555 666 777             34567       78888       88889       89 10 J
     */
    Carder.prototype.isPlanAndsingle = function (cardList) {
        if (cardList.length < 8 || cardList.length > 20)
            return false;
        //分类，相同数字的牌放一堆
        var map = new Map();
        this.classify(map, cardList);
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
            console.log(threeList[threeList.length - 1] + " - " + threeList[threeList.length - 2]);
            //threeList可以看作是已排序的，所以只需要判断前后两端是否排好序
            if (threeList[threeList.length - 1] - threeList[threeList.length - 2] !== 1) {
                var k = threeList.pop();
                if (!!k) {
                    otherList.push(k);
                    otherList.push(k);
                    otherList.push(k);
                }
            }
            else {
                var k = threeList.shift();
                if (!!k) {
                    otherList.push(k);
                    otherList.push(k);
                    otherList.push(k);
                }
            }
        }
        console.log("threeList len:" + threeList + "-otherList len:" + otherList);
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
    Carder.prototype.isPlanAndDouble = function (cardList) {
        if (cardList.length !== 10)
            return false;
        //分类，相同数字的牌放一堆
        var map = new Map();
        this.classify(map, cardList);
        if (map.size !== 4)
            return false;
        var threeList = new Array();
        var doubleCount = 0;
        map.forEach(function (v, k) {
            if (v === 3) {
                threeList.push(k);
            }
            else if (v === 2) {
                doubleCount++;
            }
        });
        if (threeList.length !== 2 || doubleCount !== 2)
            return false;
        if (Math.abs(threeList[0] - threeList[1]) !== 1)
            return false;
        return true;
    };
    /**顺子 */
    Carder.prototype.isStraight = function (cardList) {
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
    Carder.prototype.isLianDui = function (cardList) {
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
        this.classify(map, cardList);
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
    /**分类，相同数字的牌放一堆 */
    Carder.prototype.classify = function (map, cardList) {
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
    /**********牌面比较，cardList已排序*********** */
    /**
     * 单张牌比较牌面大小
     * @param cardListA 上次的出牌
     * @param cardListB 当前的出牌
     */
    Carder.prototype.compareSingle = function (cardListA, cardListB) {
        return cardListB[0].getNumber() > cardListA[0].getNumber();
    };
    /**比较一对 */
    Carder.prototype.compareDouble = function (cardListA, cardListB) {
        return this.compareSingle(cardListA, cardListB);
    };
    /**比较三张不带 */
    Carder.prototype.compareThree = function (cardListA, cardListB) {
        return this.compareSingle(cardListA, cardListB);
    };
    /**比较普通炸弹 */
    Carder.prototype.compareBoom = function (cardListA, cardListB) {
        return this.compareSingle(cardListA, cardListB);
    };
    /**比较王炸 */
    Carder.prototype.compareJokerBoom = function (cardListA, cardListB) {
        return true;
    };
    return Carder;
}());
exports.Carder = Carder;
var carder = new Carder();
