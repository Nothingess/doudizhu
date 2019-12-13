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
        if (cardList.length !== 6)
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
        var map = new Map();
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
        //牌堆数量
        if (map.size !== 2)
            return false;
        var cardVal = [];
        map.forEach(function (v, k) {
            if (v !== 3)
                return false;
            cardVal.push(k);
        });
        //判断相邻
        if (Math.abs(cardVal[0] - cardVal[1]) !== 1)
            return false;
        return true;
    };
    /**飞机带两个单(也可以带一对) */
    Carder.prototype.isPlanAndsingle = function (cardList) {
        if (cardList.length !== 8)
            return false;
        //分类，相同数字的牌放一堆
        var map = new Map();
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
        //单独的那两张是一对的也可以，如：[333 444 55] [333 444 56]（这两首牌都可以，但不能为一对王牌）
        if (map.size !== 3 && map.size !== 4)
            return false;
        //判断是否有两堆牌里有三张牌
        var threeList = new Array(); //这里存的是key（即：牌面数字大小）
        var otherList = new Array();
        map.forEach(function (v, k) {
            if (v === 3) {
                threeList.push(k);
            }
            else if (v === 2) {
                otherList.push(k);
                otherList.push(k);
            }
            else {
                otherList.push(k);
            }
        });
        if (threeList.length !== 2 || otherList.length !== 2)
            return false;
        //判断 otherlist 里的两张牌是否是一对
        if (otherList[0] === otherList[1]) {
            if (otherList[0] >= GameConst_1.CardVal.SMALL)
                return false; //王牌（王炸）
        }
        //判断飞机是否相邻
        if (Math.abs(threeList[0] - threeList[1]) !== 1)
            return false;
        return true;
    };
    return Carder;
}());
exports.Carder = Carder;
var carder = new Carder();
