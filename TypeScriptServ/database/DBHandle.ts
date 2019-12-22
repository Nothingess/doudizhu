import { Connection, ConnectionConfig, MysqlError, FieldInfo, createPool, Pool, escape } from "mysql";
import { dbCallBack, DBRes } from "../game/GameConst";

let dbConfig: ConnectionConfig = {
    host: 'localhost',
    user: 'root',
    password: '241659',
    port: 3306,
    database: 'doudizhu',
    multipleStatements: true
}

export class DBHandle {
    private mMySqlConnPool: Pool;

    constructor() {
        this.mMySqlConnPool = createPool(dbConfig);
        this.register({ username: 'Tery', pwd: 'pvs241659' }, (dbRes: DBRes) => {
            console.log(dbRes);
        })
    }
    /**获取连接对象 */
    private getConnection(callback: dbCallBack): void {
        this.mMySqlConnPool.getConnection(function (err: MysqlError, mysqlConn: Connection) {
            if (err) {
                console.error(`DBHandle [GET CONN ERR] - ${err}`);
                callback({ code: -1 });
            } else {
                callback({ code: 1, data: mysqlConn });
            }
        })
    }


    /**
     * 用户登陆，查询该用户是否存在
     * @param data 用户名和密码 
     * @param callback 回调
     */
    public loginIn(data: { username: string, pwd: string }, callback: dbCallBack): void {
        //TODO 检测用户名和密码是否符合规格（防sql注入）
        let query: dbCallBack = (dbRes: DBRes) => {
            if (dbRes.code === 1) {//获取到 mysqlConn 连接对象
                let sql: string = `select * from users where username='${
                    data.username}' and password='${data.pwd}'`;
                dbRes.data.query(sql, sql, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
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
                });
                dbRes.data.release();
            } else {
                callback({ code: -1 });
            }
        }
        this.getConnection(query);
    }
    /**
     * 注册用户
     * @param data 用户名和密码
     * @param callback 回调
     */
    public register(data: { username: string, pwd: string }, callback: dbCallBack): void {
        //TODO 检测用户名和密码是否符合规格（防sql注入）
        let self: DBHandle = this;
        let insertUserName: dbCallBack = function (dbRes: DBRes) {
            if (dbRes.code === 1) {//用户名没有重复
                self.insertUserInfo(data, (dbRes: DBRes) => {
                    if (dbRes.code === 1) { callback({ code: 1 }) }
                    else { callback({ code: -1 }) }
                });
            } else {
                callback({ code: 0 });
            }
        };
        let query: dbCallBack = (dbRes: DBRes) => {
            if (dbRes.code === 1) {
                this.checkUserName(data.username, insertUserName);
            } else {
                callback({ code: -1 });
            }
        }
        this.getConnection(query);
    }
    /**插入注册信息 */
    private insertUserInfo(data: { username: string, pwd: string }, callback: dbCallBack): void {
        let query: dbCallBack = (dbRes: DBRes) => {
            if (dbRes.code === 1) {
                let sql: string = `insert into users set ?`;
                dbRes.data.query(sql, { username: data.username, password: data.pwd },
                    (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
                        if (err) {
                            callback({ code: -1 });
                            console.error('DBHandle [REGISTER ERR] - ', err.message);
                            return;
                        }
                        console.error('DBHandle [INSERT USER INFO SUC]');
                        callback({ code: 1 });
                    });
                dbRes.data.release();
            } else {
                callback({ code: -1 });
            }
        }
        this.getConnection(query);
    }
    /**检测用户名是否能用（是否重复） */
    private checkUserName(username: string, callback: dbCallBack): void {
        let query: dbCallBack = (dbRes: DBRes) => {
            if (dbRes.code === 1) {
                let sql: string = `select * from users where username='${username}'`;
                dbRes.data.query(sql, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
                    if (err) {
                        callback({ code: -1 });
                        console.error('DBHandle [CHECK USER NAME ERR] - ', err.message);
                        return;
                    }
                    if (results.length >= 1) {//用户名已存在，注册失败
                        callback({ code: 0 });
                        console.log('DBHandle [CHECK USER NAME FAIL] - username already exist');
                        return;
                    }
                    //TODO 插入账号密码
                    callback({ code: 1 });
                });
                dbRes.data.release();
            } else {
                callback({ code: -1 });
            }
        }
        this.getConnection(query);
    }
    /**
     * 申请添加好友
     * @param data 发起申请的玩家、被申请的玩家
     * @param callback 回调
     */
    public reqFriend(data: { reqUserName: string, resUserName: string }, callback: dbCallBack): void {
        let self: DBHandle = this;
        let insertReq = () => {//插入好友请求的记录
            self.getConnection((dbRes: DBRes) => {
                if (dbRes.code === 1) {
                    let sql: string = `insert into reqfriends set ?`;
                    dbRes.data.query(sql, { requid: escape(data.reqUserName), resuid: escape(data.resUserName) },
                        (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
                            if (err) {
                                callback({ code: -1 });
                                console.error('DBHandle [REQUREST FRIEND ERR] - ', err.message);
                                return;
                            }
                            callback({ code: 1 });
                            console.log('DBHandle [REQUREST FRIEND SUC] - ', JSON.stringify(results));
                        });
                    dbRes.data.release();
                }
                else {
                    callback({ code: -1 });
                }
            })
        }


        let query: dbCallBack = (dbRes: DBRes) => {
            if (dbRes.code === 1) {
                let reqName: string = escape(data.reqUserName);
                let resName: string = escape(data.resUserName);
                let sqlCheckFriend: string = `select * from friends where (uid='${
                    reqName}' and fid='${resName}') or (uid='${resName}' and fid='${reqName}')`;
                let sqlCheckReq: string = `select * from reqfriends where requid='${
                    reqName}' and resuid='${resName}'`;
                dbRes.data.query(`${sqlCheckFriend};${sqlCheckReq}`, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
                    if (err) {
                        callback({ code: -1 });
                    } else {
                        if (results[0].length === 0 && results[1].length === 0) {//不是好友并且没有好友申请记录
                            insertReq();
                        } else {
                            callback({ code: 0 });
                        }
                    }
                });
                dbRes.data.release();
            } else {
                callback({ code: -1 });
            }
        }
        this.getConnection(query);
    }
    /**接受好友申请 */
    public acceptFriend(data: { reqUserName: string, resUserName: string }, callback: dbCallBack): void {
        //TODO 检测是否已经是好友
        this.checkFriend({ userA: data.reqUserName, userB: data.resUserName }, (dbRes: DBRes) => {
            if (dbRes.code === 0) {//不是好友，可以进行添加
                this.getConnection((dbRes: DBRes) => {
                    if (dbRes.code === 1) {
                        let sql: string = `insert into friends set ?`;
                        dbRes.data.query(sql, { uid: data.reqUserName, fid: data.resUserName },
                            (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
                                if (err) {
                                    callback({ code: -1 });
                                    console.error('DBHandle [ACCEPT FRIEND ERR] - ', err.message);
                                    return;
                                }
                                callback({ code: 1 });
                                console.log('DBHandle [ACCEPT FRIEND SUC] - ', JSON.stringify(results));
                            });
                        dbRes.data.release();
                    } else {
                        callback({ code: 0 });
                    }
                });
            } else {
                callback({ code: 0 });
            }
        })
    }
    /**删除好友 */
    public removeFriend(data: { userA: string, userB: string }, callback: dbCallBack): void {
        this.checkFriend({ userA: data.userA, userB: data.userB }, (dbResCheck: DBRes) => {
            if (dbResCheck.code === 1) {//双方互为好友，可以进行删除操作
                this.getConnection((dbResConn: DBRes) => {
                    if (dbResConn.code === 1) {
                        let sql: string = `delete from friends WHERE uid = '${
                            dbResCheck.data[0].uid}' and fid = '${dbResCheck.data[0].fid}'`;
                        dbResConn.data.query(sql, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
                            if (err) {
                                callback({ code: -1 });
                                console.error('DBHandle [REMOVE FRIEND ERR] - ', err.message);
                                return;
                            }
                            callback({ code: 1 });
                            console.log('DBHandle [REMOVE FRIEND SUC] - ', JSON.stringify(results));
                        });
                        dbResConn.data.release();
                    } else {
                        callback({ code: 0 });
                    }
                });
            } else {
                callback({ code: 0 });
            }
        })
    }
    /**检测是否是好友 */
    private checkFriend(data: { userA: string, userB: string }, callback: dbCallBack): void {
        let query: dbCallBack = (dbRes: DBRes) => {
            if (dbRes.code === 1) {
                let checkUserA: string = escape(data.userA);
                let checkUserB: string = escape(data.userB);
                let sql: string = `select * from friends where (uid='${
                    checkUserA}' and fid='${checkUserB}') or (uid='${checkUserB}' and fid='${checkUserA}')`;
                dbRes.data.query(sql, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
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
                });
                dbRes.data.release();
            } else {
                callback({ code: -1 });
            }
        }
        this.getConnection(query);
    }
}

let sql: DBHandle = new DBHandle();