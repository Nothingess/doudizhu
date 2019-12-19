"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = require("mysql");
var dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'pvs241659',
    port: 3306,
    database: 'doudizhu'
};
var DBHandle = /** @class */ (function () {
    function DBHandle() {
        this.mMySqlConn = mysql_1.createConnection(dbConfig);
        this.connect();
    }
    /**连接数据库 */
    DBHandle.prototype.connect = function () {
        var _this = this;
        this.mMySqlConn.connect(function (err) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (err) {
                console.error("\u6570\u636E\u5E93\u8FDE\u63A5\u5931\u8D25\uFF1A" + err);
                return;
            }
            console.log("\u6570\u636E\u5E93\u8FDE\u63A5\u6210\u529F\uFF1A" + JSON.stringify(args));
            _this.loginIn({ username: 'Tery', pwd: 'pvs241659' }, function (code) {
                console.log(code);
            });
        });
    };
    /**检测连接是否断开 */
    DBHandle.prototype.checkSql = function () {
        if (this.mMySqlConn.state !== 'connected') {
            console.error("\u6570\u636E\u5E93\u5DF2\u65AD\u5F00\u8FDE\u63A5\uFF1A" + this.mMySqlConn.state);
            return false;
        }
        return true;
    };
    /**增 */
    DBHandle.prototype.insert = function (tableName, data) {
        if (!this.checkSql())
            return;
        var sqlStr = "insert into " + tableName + " set ?";
        this.mMySqlConn.query(sqlStr, data, function (err, results, fields) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------INSERT----------------------------');
            console.log("results\uFF1A" + JSON.stringify(results));
        });
    };
    /**删 */
    DBHandle.prototype.delete = function () {
        if (!this.checkSql())
            return;
    };
    /**改 */
    DBHandle.prototype.update = function () {
        if (!this.checkSql())
            return;
    };
    /**查 */
    DBHandle.prototype.select = function () {
        if (!this.checkSql())
            return;
    };
    /**
     * 用户登陆，查询该用户是否存在
     * @param data 用户名和密码
     * @param callback 回调
     */
    DBHandle.prototype.loginIn = function (data, callback) {
        if (!this.checkSql())
            return;
        //TODO 检测用户名和密码是否符合规格（防sql注入）
        var sql = "select * from users where username='" + data.username + "' and password='" + data.pwd + "'";
        this.mMySqlConn.query(sql, function (err, results, fields) {
            if (err) {
                callback(-1);
                console.error('DBHandle [LOGIN IN ERR] - ', err.message);
                return;
            }
            callback(1);
            console.log('DBHandle [LOGIN IN SUC] - ', JSON.stringify(results));
        });
    };
    DBHandle.prototype.register = function (data, callback) {
        if (!this.checkSql())
            return;
        //TODO 检测用户名和密码是否符合规格（防sql注入）
    };
    return DBHandle;
}());
exports.DBHandle = DBHandle;
var sql = new DBHandle();
