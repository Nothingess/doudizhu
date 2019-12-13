"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var GameConst_1 = require("./GameConst");
var ICard = /** @class */ (function () {
    function ICard(val) {
        this.mNumber = val;
        this.mIsJoker = (val >= GameConst_1.CardVal.SMALL);
    }
    ICard.prototype.isJoker = function () { return this.mIsJoker; };
    ICard.prototype.getNumber = function () { return this.mNumber; };
    return ICard;
}());
exports.ICard = ICard;
var NormalCard = /** @class */ (function (_super) {
    __extends(NormalCard, _super);
    function NormalCard(val, cardType) {
        var _this = _super.call(this, val) || this;
        _this.mCardType = cardType;
        return _this;
    }
    NormalCard.prototype.getCardType = function () { return this.mCardType; };
    return NormalCard;
}(ICard));
exports.NormalCard = NormalCard;
