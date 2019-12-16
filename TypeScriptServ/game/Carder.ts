import { ICard, NormalCard } from "./Card";
import { CardVal, CardType } from "./GameConst";

export class Carder {
    private mCardList: Array<ICard>;

    constructor() {
        this.mCardList = new Array<ICard>();

        this.createCard();
        this.shuffleCard();
        this.deal();
    }

    /**实例化一副完整扑克 54 张 */
    private createCard(): void {
        let val: CardVal;
        let type: CardType;
        for (const cardVal in CardVal) {
            val = parseInt(cardVal);
            if (!val) continue;

            //判断是否是王牌
            if (val >= CardVal.SMALL) {
                this.mCardList.push(new ICard(val));
                continue;
            }

            for (const cardType in CardType) {
                type = parseInt(cardType);
                if (!type) continue;
                this.mCardList.push(new NormalCard(val, type));
            }
        }
    }
    /**洗牌 */
    private shuffleCard(): void {
        let randomIndex: number;
        let tmpCard: ICard;
        for (var i = this.mCardList.length - 1; i >= 0; i--) {
            randomIndex = Math.floor(Math.random() * (i + 1));
            //随机交换
            tmpCard = this.mCardList[randomIndex];
            this.mCardList[randomIndex] = this.mCardList[i];
            this.mCardList[i] = tmpCard;
        }
    }
    /**发牌 */
    private deal(): Array<Array<ICard>> {
        let list: Array<Array<ICard>> = [[], [], [], []];//牌堆三分 + 三张底牌
        let index: number = 0;

        for (let i = 0; i < this.mCardList.length; i++) {

            if (i >= this.mCardList.length - 3) {
                list[3].push(this.mCardList[i]);
                continue;
            }

            list[index].push(this.mCardList[i]);

            index++;
            index %= list.length - 1;
        }

        return list;
    }

    /**********出牌类型，cardList已排序*********** */
    /**出一张牌 */
    public isSingleCard(cardList: Array<ICard>): boolean {
        return cardList.length === 1;
    }
    /**出一对 */
    public isDoubleCard(cardList: Array<ICard>): boolean {
        if (cardList.length !== 2) return false;

        if (cardList[0].isJoker()
            || cardList[0].getNumber() !== cardList[1].getNumber()) {
            return false;
        }

        return true;
    }
    /**三张不带 */
    public isThree(cardList: Array<ICard>): boolean {
        if (cardList.length !== 3) return false;

        if (cardList[0].getNumber() !== cardList[1].getNumber()
            || cardList[1].getNumber() !== cardList[2].getNumber()) {
            return false;
        }

        return true;
    }
    /**三带一 */
    public isThreeAndOne(cardList: Array<ICard>): boolean {
        if (cardList.length !== 4) return false;

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
    }
    /**三带二 */
    public IsThreeAndTwo(cardList: Array<ICard>): boolean {
        if (cardList.length !== 5) return false;

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
    }
    /**四张炸弹 */
    public isBoom(cardList: Array<ICard>): boolean {
        if (cardList.length !== 4) return false;

        if (cardList[0].getNumber() === cardList[1].getNumber()
            && cardList[1].getNumber() === cardList[2].getNumber()
            && cardList[2].getNumber() === cardList[3].getNumber()) {
            return true;
        }

        return false;
    }
    /**王炸 */
    public isJokerBoom(cardList: Array<ICard>): boolean {
        if (cardList.length !== 2) return false;

        if (cardList[0].isJoker() && cardList[1].isJoker()) return true;
        return false;
    }
    /**飞机不带 */
    public isPlannAndNone(cardList: Array<ICard>): boolean {
        if (cardList.length !== 6) return false;

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
        let map: Map<number, number> = new Map<number, number>();
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

        return true;
    }
    /**飞机带两个单(也可以带一对) */
    public isPlanAndsingle(cardList: Array<ICard>): boolean {
        if (cardList.length !== 8) return false;

        //分类，相同数字的牌放一堆
        let map: Map<number, number> = new Map<number, number>();
        this.classify(map, cardList);
        //单独的那两张是一对的也可以，如：[333 444 55] [333 444 56]（这两首牌都可以）
        if (map.size !== 3 && map.size !== 4) return false;
        //判断是否有两堆牌里有三张牌
        let threeList: Array<number> = new Array<number>();//这里存的是key（即：牌面数字大小）
        let otherList: Array<number> = new Array<number>();
        map.forEach((v, k) => {
            if (v === 3) {
                threeList.push(k);
            } else if (v === 2) {
                otherList.push(k);
                otherList.push(k);
            } else {
                otherList.push(k);
            }
        })
        if (threeList.length !== 2 || otherList.length !== 2) return false;
        //判断飞机是否相邻
        if (Math.abs(threeList[0] - threeList[1]) !== 1) return false;

        return true;
    }
    /**飞机带两对 */
    public isPlanAndDouble(cardList: Array<ICard>): boolean {
        if (cardList.length !== 10) return false;

        //分类，相同数字的牌放一堆
        let map: Map<number, number> = new Map<number, number>();
        this.classify(map, cardList);
        if (map.size !== 4) return false;
        let threeList: Array<number> = new Array<number>();
        let doubleCount: number = 0;
        map.forEach((v, k) => {
            if (v === 3) {
                threeList.push(k);
            } else if (v === 2) {
                doubleCount++;
            }
        })
        if (threeList.length !== 2 || doubleCount !== 2) return false;
        if (Math.abs(threeList[0] - threeList[1]) !== 1) return false;

        return true;
    }
    /**顺子 */
    public isStraight(cardList: Array<ICard>): boolean {
        if (cardList.length < 5 || cardList.length > 12) return false;

        //不能有2或者大小王
        for (let i = 0; i < cardList.length; i++) {
            if (cardList[i].getNumber() >= CardVal.TWO) {
                return false;
            }
        }
        //判断是否是按顺序无重复的排序
        for (let j = 0; j < cardList.length - 1; j++) {
            if (cardList[j + 1].getNumber() - cardList[j].getNumber() !== 1) return false;
        }

        return true;
    }
    /**连对 */
    public isLianDui(cardList: Array<ICard>): boolean {
        if (cardList.length < 6 || cardList.length > 24) return false;

        //不能有2或者大小王
        for (let i = 0; i < cardList.length; i++) {
            if (cardList[i].getNumber() >= CardVal.TWO) {
                return false;
            }
        }
        //分类，相同数字的牌放一堆
        let map: Map<number, number> = new Map<number, number>();
        this.classify(map, cardList);
        //相同牌面（数字）的牌只能是两张
        map.forEach((v, k) => { if (v !== 2) return false; })
        if (map.size < 3) return false;
        //判断是否是按顺序无重复的排序
        for (let j = 0; j < cardList.length - 2; j += 2) {
            if (cardList[j + 2].getNumber() - cardList[j].getNumber() !== 1) return false;
        }

        return true;
    }
    /**分类，相同数字的牌放一堆 */
    private classify(map: Map<number, number>, cardList: Array<ICard>): void {
        for (let i = 0; i < cardList.length; i++) {
            let val: number | undefined = map.get(cardList[i].getNumber());
            if (!!val) {
                val++;
                map.set(cardList[i].getNumber(), val);
            } else {
                map.set(cardList[i].getNumber(), 1);
            }
        }
    }


    /**********牌面比较，cardList已排序*********** */
    /**
     * 单张牌比较牌面大小
     * @param cardListA 上次的出牌
     * @param cardListB 当前的出牌
     */
    public compareSingle(cardListA: Array<ICard>, cardListB: Array<ICard>): boolean {
        return cardListB[0].getNumber() > cardListA[0].getNumber();
    }
    /**比较一对 */
    public compareDouble(cardListA: Array<ICard>, cardListB: Array<ICard>): boolean {
        return this.compareSingle(cardListA, cardListB);
    }
    /**比较三张不带 */
    public compareThree(cardListA: Array<ICard>, cardListB: Array<ICard>): boolean {
        return this.compareSingle(cardListA, cardListB);
    }
    /**比较普通炸弹 */
    public compareBoom(cardListA: Array<ICard>, cardListB: Array<ICard>): boolean {
        return this.compareSingle(cardListA, cardListB);
    }
    /**比较王炸 */
    public compareJokerBoom(cardListA: Array<ICard>, cardListB: Array<ICard>): boolean {
        return true;
    }
/*     public compareThreeAndOne(cardListA: Array<ICard>, cardListB: Array<ICard>): boolean {

    } */
}

let carder: Carder = new Carder();
