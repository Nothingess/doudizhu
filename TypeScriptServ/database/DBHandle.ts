import { createConnection, Connection, ConnectionConfig, MysqlError, FieldInfo } from "mysql";
import { dbCallBack, DBRes } from "../game/GameConst";

let dbConfig: ConnectionConfig = {
    host: 'localhost',
    user: 'root',
    password: 'pvs241659',
    port: 3306,
    database: 'doudizhu'
}

export class DBHandle {
    private mMySqlConn: Connection;

    constructor() {
        this.mMySqlConn = createConnection(dbConfig)

        this.connect();
    }

    /**连接数据库 */
    private connect(): void {
        this.mMySqlConn.connect((err: MysqlError, ...args: any[]) => {
            if (err) {
                console.error(`[DB CONNECT ERR] - ${err}`);
                return;
            }
            console.log(`[DB CONNECT SUC] - ${JSON.stringify(args)}`);
            this.register({ username: 'taowei', pwd: '88888888' }, (dbRes: DBRes) => {
                if (dbRes.code === 1) {
                    console.log('注册成功');
                } else {
                    console.log('注册失败');
                }
            })
        });
    }
    /**检测连接是否断开 */
    private checkSql(): boolean {
        if (this.mMySqlConn.state !== 'connected') {
            console.error(`[DB BREAK] - ${this.mMySqlConn.state}`);
            return false;
        }
        return true;
    }


    /**
     * 用户登陆，查询该用户是否存在
     * @param data 用户名和密码 
     * @param callback 回调
     */
    public loginIn(data: { username: string, pwd: string }, callback: dbCallBack): void {
        if (!this.checkSql()) return;
        //TODO 检测用户名和密码是否符合规格（防sql注入）
        let sql: string = `select * from users where username='${
            data.username}' and password='${data.pwd}'`;
        this.mMySqlConn.query(sql, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
            if (err) {//操作失败
                callback({ code: -1 });
                console.error('DBHandle [LOGIN IN ERR] - ', err.message);
                return;
            }
            if (results.length >= 1) {//用户存在，返回用户数据
                //通过用户名获取用户信息并返回给玩家
                callback({ code: 1 });
                console.log('DBHandle [LOGIN IN SUC] - ', JSON.stringify(results));
                return;
            }
            //用户不存在
            callback({ code: 0 });
            console.log('DBHandle [LOGIN IN FAIL] - username or password wrong');
        })
    }
    /**
     * 注册用户
     * @param data 用户名和密码
     * @param callback 回调
     */
    public register(data: { username: string, pwd: string }, callback: dbCallBack): void {
        if (!this.checkSql()) return;
        //TODO 检测用户名和密码是否符合规格（防sql注入）
        let self: DBHandle = this;
        let insertUserName: dbCallBack = function (dbRes: DBRes) {
            if (dbRes.code === 0) {//用户名没有重复
                let sql: string = `insert into users set ?`;
                self.mMySqlConn.query(sql, { username: data.username, password: data.pwd },
                    (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
                        if (err) {
                            callback({ code: -1 });
                            console.error('DBHandle [REGISTER ERR] - ', err.message);
                            return;
                        }
                        callback({ code: 1 });
                    })
            } else {
                callback({ code: 0 });
            }
        }
        this.checkUserName(data.username, insertUserName);
    }
    /**检测用户名是否能用（是否重复） */
    private checkUserName(username: string, callback: dbCallBack): void {
        let sql: string = `select * from users where username='${username}'`;
        this.mMySqlConn.query(sql, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
            if (err) {
                callback({ code: -1 });
                console.error('DBHandle [CHECK USER NAME ERR] - ', err.message);
                return;
            }
            if (results.length >= 1) {//用户名已存在，注册失败
                callback({ code: 1 });
                console.log('DBHandle [CHECK USER NAME FAIL] - username already exist');
                return;
            }
            //TODO 插入账号密码
            callback({ code: 0 });
        })
    }
    /**
     * 申请添加好友
     * @param data 发起申请的玩家、被申请的玩家
     * @param callback 回调
     */
    public reqFriend(data: { reqUserName: string, resUserName: string }, callback: dbCallBack): void {
        if (!this.checkSql()) return;
        let self: DBHandle = this;
        let insertReq: dbCallBack = function (dbRes: DBRes) {//插入好友请求的记录
            if (dbRes.code === 0) {//没有申请记录，可以插入申请
                let sql: string = `insert into reqfriends set ?`;
                self.mMySqlConn.query(sql, { requid: data.reqUserName, resuid: data.resUserName },
                    (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
                        if (err) {
                            callback({ code: -1 });
                            console.error('DBHandle [REQUREST FRIEND ERR] - ', err.message);
                            return;
                        }
                        callback({ code: 1 });
                        console.log('DBHandle [REQUREST FRIEND SUC] - ', JSON.stringify(results));
                    })
            } else {
                callback({ code: 0 });
            }
        }
        //检测是否已经为好友
        this.checkReqFriend({ userA: data.reqUserName, userB: data.resUserName }, insertReq);
    }
    /**接受好友申请 */
    public acceptFriend(data: { reqUserName: string, resUserName: string }, callback: dbCallBack): void {
        //TODO 检测是否已经是好友
        this.checkFriend({ userA: data.reqUserName, userB: data.resUserName }, (dbRes: DBRes) => {
            if (dbRes.code === 0) {//双方不是好友，可以进行添加
                let sql: string = `insert into friends set ?`;
                this.mMySqlConn.query(sql, { uid: data.reqUserName, fid: data.resUserName },
                    (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
                        if (err) {
                            callback({ code: -1 });
                            console.error('DBHandle [ACCEPT FRIEND ERR] - ', err.message);
                            return;
                        }
                        callback({ code: 1 });
                        console.log('DBHandle [ACCEPT FRIEND SUC] - ', JSON.stringify(results));
                    })
            } else {
                callback({ code: 0 });
            }
        })
    }
    /**删除好友 */
    public removeFriend(data: { userA: string, userB: string }, callback: dbCallBack): void {
        if (!this.checkSql()) return;
        this.checkFriend({ userA: data.userA, userB: data.userB }, (dbRes: DBRes) => {
            if (dbRes.code === 1) {//双方互为好友，可以进行删除操作
                let sql: string = `delete from friends WHERE uid = '${
                    dbRes.data[0].uid}' and fid = '${dbRes.data[0].fid}'`;
                this.mMySqlConn.query(sql, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
                    if (err) {
                        callback({ code: -1 });
                        console.error('DBHandle [REMOVE FRIEND ERR] - ', err.message);
                        return;
                    }
                    callback({ code: 1 });
                    console.log('DBHandle [REMOVE FRIEND SUC] - ', JSON.stringify(results));
                })
            } else {
                callback({ code: 0 });
            }
        })
    }
    /**检测是否是好友 */
    private checkFriend(data: { userA: string, userB: string }, callback: dbCallBack): void {
        if (!this.checkSql()) return;
        let sql: string = `select * from friends where (uid='${
            data.userA}' and fid='${data.userB}') or (uid='${data.userB}' and fid='${data.userA}')`;
        this.mMySqlConn.query(sql, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
            if (err) {
                callback({ code: -1 });
                console.error('DBHandle [CHECK FRIEND ERR] - ', err.message);
                return;
            }
            if (results.length >= 1) {
                callback({ code: 1, data: results });
                console.log(`DBHandle [CHECK FRIEND SUC] - ${data.userA} and ${data.userB} is friend`);
                return;
            }
            callback({ code: 0 });
            console.log(`DBHandle [CHECK FRIEND FAIL] - ${data.userA} and ${data.userB} not friend`);
        })
    }
    /**检测是否有好友申请记录 */
    private checkReqFriend(data: { userA: string, userB: string }, callback: dbCallBack): void {
        if (!this.checkSql()) return;
        let sql: string = `select * from reqfriends where requid='${
            data.userA}' and resuid='${data.userB}'`;
        this.mMySqlConn.query(sql, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
            if (err) {
                callback({ code: -1 });
                console.error('DBHandle [CHECK REQUEST FRIEND ERR] - ', err.message);
                return;
            }
            if (results.length >= 1) {
                callback({ code: 1, data: results });
                console.log(`DBHandle [CHECK REQUEST FRIEND SUC] - ${data.userA} and ${data.userB} have record`);
                return;
            }
            callback({ code: 0 });
            console.log(`DBHandle [CHECK REQUEST FRIEND FAIL] - ${data.userA} and ${data.userB} not record`);
        })

    }
}

let sql: DBHandle = new DBHandle();