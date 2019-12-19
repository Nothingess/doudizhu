import { Client } from "../core/Client";
import { PlayerInfo } from "./GameConst";
import { ICard } from "./Card";

/**玩家登录后进入主页面实例的玩家对象（游戏层） */
export class Player {
    private mClient: Client;
    private mInfo: PlayerInfo;
    private mGamePlay: GamePlay | undefined;

    constructor(client: Client, info: PlayerInfo) {
        this.mClient = client;
        this.mInfo = info;
    }

    public send(message: string | Buffer | ArrayBuffer | Buffer[]): void {
        this.mClient.send(message);
    }
}

/**开局游戏（玩家加入房间后实例的游戏对象） */
export class GamePlay {
    private mPlayer: Player;            //玩家引用
    private mRoom: any;                 //加入的房间
    private mIsReady: boolean;          //是否准备
    private mSeatIndex: number;         //房间的所在位置
    private mCards: Array<ICard>;       //手牌

    constructor(player: Player, room: any, index: number) {

        this.mPlayer = player;
        this.mRoom = room;
        this.mIsReady = false;
        this.mSeatIndex = index;
        this.mCards = new Array<ICard>();

    }

    public send(message: string | Buffer | ArrayBuffer | Buffer[]): void {
        this.mPlayer.send(message);
    }
}