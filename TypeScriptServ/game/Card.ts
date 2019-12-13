import { CardType, CardVal } from "./GameConst";

export class ICard {
    protected mIsJoker: boolean;
    protected mNumber: CardVal;
    public isJoker(): boolean { return this.mIsJoker }
    public getNumber(): number { return this.mNumber }

    constructor(val: CardVal) {
        this.mNumber = val;
        this.mIsJoker = (val >= CardVal.SMALL);
    }
}

export class NormalCard extends ICard {
    protected mCardType: CardType;
    public getCardType(): CardType { return this.mCardType }

    constructor(val: CardVal, cardType: CardType) {
        super(val);
        this.mCardType = cardType;
    }
}