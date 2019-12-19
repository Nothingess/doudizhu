import { createConnection, Connection, ConnectionConfig, MysqlError, FieldInfo } from "mysql";

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
                console.error(`数据库连接失败：${err}`);
                return;
            }
            console.log(`数据库连接成功：${JSON.stringify(args)}`);
            this.loginIn({ username: 'Tery', pwd: 'pvs241659' }, (code: number) => {
                console.log(code);
            })
        });
    }

    /**检测连接是否断开 */
    private checkSql(): boolean {
        if (this.mMySqlConn.state !== 'connected') {
            console.error(`数据库已断开连接：${this.mMySqlConn.state}`);
            return false;
        }
        return true;
    }
    /**增 */
    public insert(tableName: any, data: any): void {
        if (!this.checkSql()) return;
        let sqlStr: string = `insert into ${tableName} set ?`;
        this.mMySqlConn.query(sqlStr, data, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------INSERT----------------------------');
            console.log(`results：${JSON.stringify(results)}`);
        })
    }
    /**删 */
    public delete(): void {
        if (!this.checkSql()) return;
    }
    /**改 */
    public update(): void {
        if (!this.checkSql()) return;
    }
    /**查 */
    public select(): void {
        if (!this.checkSql()) return;
    }


    /**
     * 用户登陆，查询该用户是否存在
     * @param data 用户名和密码 
     * @param callback 回调
     */
    public loginIn(data: { username: string, pwd: string }, callback: Function): void {
        if (!this.checkSql()) return;
        //TODO 检测用户名和密码是否符合规格（防sql注入）
        let sql: string = `select * from users where username='${
            data.username}' and password='${data.pwd}'`;
        this.mMySqlConn.query(sql, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
            if (err) {
                callback(-1);
                console.error('DBHandle [LOGIN IN ERR] - ', err.message);
                return;
            }
            callback(1);
            console.log('DBHandle [LOGIN IN SUC] - ', JSON.stringify(results));
        })
    }
    public register(data: { username: string, pwd: string }, callback: Function): void {
        if (!this.checkSql()) return;
        //TODO 检测用户名和密码是否符合规格（防sql注入）
    }
}

let sql: DBHandle = new DBHandle();