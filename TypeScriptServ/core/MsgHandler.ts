export class IHandler {
    protected mInterestCMD: Map<number, Function>;

    constructor() {
        this.mInterestCMD = new Map<number, Function>();
    }
}