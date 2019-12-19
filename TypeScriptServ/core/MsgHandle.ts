import { NetCMD, ResponseMsg } from "../game/GameConst";
import { Client } from "./Client";
import { Player, GamePlay } from "../game/Player";

export class IHandle {
    protected mInterestCMD: Map<number, Function>;

    constructor() {
        this.mInterestCMD = new Map<number, Function>();
    }
    /**
     * 监听感兴趣的命令
     * @param cmd 命令
     * @param handle 执行函数
     */
    protected addInterestCMD(cmd: number, handle: Function): void {
        if (!!this.mInterestCMD.get(cmd)) return;
        this.mInterestCMD.set(cmd, handle);
    }
    /**移除监听的某个命令 */
    protected removeInterestCMD(cmd: number): void {
        if (!this.mInterestCMD.get(cmd)) return;
        this.mInterestCMD.delete(cmd);
    }
    /**执行命令
     * 如果命令不存在放回 -1
     */
    public executeCMD(cmd: number, target: Client | Player | GamePlay, arg?: any): void {
        let handle: Function | undefined = this.mInterestCMD.get(cmd);
        if (!handle) {
            let response: ResponseMsg = {
                cmd: NetCMD.login_in,
                res: -1,//命令不存在
                data: null
            };
            target.send(JSON.stringify(response));
            return;
        }
        handle(target, arg);
    }
}
/**处理玩家登陆消息 */
export class HandleLoginMsg extends IHandle {
    constructor() {
        super();
        this.addInterestCMD(NetCMD.login_in, this.loginIn.bind(this));
        this.addInterestCMD(NetCMD.register, this.register.bind(this));
    }

    /**用户登陆 */
    private loginIn(client: Client, arg?: any): void {
        //TODO
        //查询用户信息
        //存在，返回登陆成功
        //不存在，放回登陆失败
    }
    /**用户注册 */
    private register(client: Client, arg?: any): void {

    }
}
/**处理玩家大厅消息 */
export class HandleLobbyMsg extends IHandle {
    constructor() {
        super();
        this.addInterestCMD(NetCMD.chat_to_world, this.chatToWorld.bind(this));
        this.addInterestCMD(NetCMD.chat_to_friend, this.chatToFriend.bind(this));
        this.addInterestCMD(NetCMD.add_firend, this.addFriend.bind(this));
        this.addInterestCMD(NetCMD.remove_friend, this.removeFriend.bind(this));
        this.addInterestCMD(NetCMD.pull_friend_info, this.pullFiriendInfo.bind(this));
        this.addInterestCMD(NetCMD.get_player_info, this.getPlayerInfo.bind(this));
        this.addInterestCMD(NetCMD.pull_room_list, this.pullRoomList.bind(this));
        this.addInterestCMD(NetCMD.req_room, this.requestRoom.bind(this));
    }

    /**世界频道聊天 */
    private chatToWorld(player: Player, arg?: any): void {

    }
    /**好友聊天 */
    private chatToFriend(player: Player, arg?: any): void {

    }
    /**添加好友 */
    private addFriend(player: Player, arg?: any): void {

    }
    /**删除好友 */
    private removeFriend(player: Player, arg?: any): void {

    }
    /**拉取好友列表 */
    private pullFiriendInfo(player: Player, arg?: any): void {

    }
    /**获取玩家信息 */
    private getPlayerInfo(player: Player, arg?: any): void {

    }
    /**获取房间列表 */
    private pullRoomList(player: Player, arg?: any): void {

    }
    /**申请加入房间 */
    private requestRoom(player: Player, arg?: any): void {

    }
}
/**处理玩家开局游戏中的消息 */
export class HandlePlayerMsg extends IHandle {

}