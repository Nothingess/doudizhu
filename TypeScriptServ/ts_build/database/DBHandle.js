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
                console.error("[DB CONNECT ERR] - " + err);
                return;
            }
            console.log("[DB CONNECT SUC] - " + JSON.stringify(args));
            _this.register({ username: 'taowei', pwd: '88888888' }, function (dbRes) {
                if (dbRes.code === 1) {
                    console.log('注册成功');
                }
                else {
                    console.log('注册失败');
                }
            });
        });
    };
    /**检测连接是否断开 */
    DBHandle.prototype.checkSql = function () {
        if (this.mMySqlConn.state !== 'connected') {
            console.error("[DB BREAK] - " + this.mMySqlConn.state);
            return false;
        }
        return true;
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
            if (err) { //操作失败
                callback({ code: -1 });
                console.error('DBHandle [LOGIN IN ERR] - ', err.message);
                return;
            }
            if (results.length >= 1) { //用户存在，返回用户数据
                //通过用户名获取用户信息并返回给玩家
                callback({ code: 1 });
                console.log('DBHandle [LOGIN IN SUC] - ', JSON.stringify(results));
                return;
            }
            //用户不存在
            callback({ code: 0 });
            console.log('DBHandle [LOGIN IN FAIL] - username or password wrong');
        });
    };
    /**
     * 注册用户
     * @param data 用户名和密码
     * @param callback 回调
     */
    DBHandle.prototype.register = function (data, callback) {
        if (!this.checkSql())
            return;
        //TODO 检测用户名和密码是否符合规格（防sql注入）
        var self = this;
        var insertUserName = function (dbRes) {
            if (dbRes.code === 0) { //用户名没有重复
                var sql_1 = "insert into users set ?";
                self.mMySqlConn.query(sql_1, { username: data.username, password: data.pwd }, function (err, results, fields) {
                    if (err) {
                        callback({ code: -1 });
                        console.error('DBHandle [REGISTER ERR] - ', err.message);
                        return;
                    }
                    callback({ code: 1 });
                });
            }
            else {
                callback({ code: 0 });
            }
        };
        this.checkUserName(data.username, insertUserName);
    };
    /**检测用户名是否能用（是否重复） */
    DBHandle.prototype.checkUserName = function (username, callback) {
        var sql = "select * from users where username='" + username + "'";
        this.mMySqlConn.query(sql, function (err, results, fields) {
            if (err) {
                callback({ code: -1 });
                console.error('DBHandle [CHECK USER NAME ERR] - ', err.message);
                return;
            }
            if (results.length >= 1) { //用户名已存在，注册失败
                callback({ code: 1 });
                console.log('DBHandle [CHECK USER NAME FAIL] - username already exist');
                return;
            }
            //TODO 插入账号密码
            callback({ code: 0 });
        });
    };
    /**
     * 申请添加好友
     * @param data 发起申请的玩家、被申请的玩家
     * @param callback 回调
     */
    DBHandle.prototype.reqFriend = function (data, callback) {
        if (!this.checkSql())
            return;
        var self = this;
        var insertReq = function (dbRes) {
            if (dbRes.code === 0) { //没有申请记录，可以插入申请
                var sql_2 = "insert into reqfriends set ?";
                self.mMySqlConn.query(sql_2, { requid: data.reqUserName, resuid: data.resUserName }, function (err, results, fields) {
                    if (err) {
                        callback({ code: -1 });
                        console.error('DBHandle [REQUREST FRIEND ERR] - ', err.message);
                        return;
                    }
                    callback({ code: 1 });
                    console.log('DBHandle [REQUREST FRIEND SUC] - ', JSON.stringify(results));
                });
            }
            else {
                callback({ code: 0 });
            }
        };
        //检测是否已经为好友
        this.checkReqFriend({ userA: data.reqUserName, userB: data.resUserName }, insertReq);
    };
    /**接受好友申请 */
    DBHandle.prototype.acceptFriend = function (data, callback) {
        var _this = this;
        //TODO 检测是否已经是好友
        this.checkFriend({ userA: data.reqUserName, userB: data.resUserName }, function (dbRes) {
            if (dbRes.code === 0) { //双方不是好友，可以进行添加
                var sql_3 = "insert into friends set ?";
                _this.mMySqlConn.query(sql_3, { uid: data.reqUserName, fid: data.resUserName }, function (err, results, fields) {
                    if (err) {
                        callback({ code: -1 });
                        console.error('DBHandle [ACCEPT FRIEND ERR] - ', err.message);
                        return;
                    }
                    callback({ code: 1 });
                    console.log('DBHandle [ACCEPT FRIEND SUC] - ', JSON.stringify(results));
                });
            }
            else {
                callback({ code: 0 });
            }
        });
    };
    /**删除好友 */
    DBHandle.prototype.removeFriend = function (data, callback) {
        var _this = this;
        if (!this.checkSql())
            return;
        this.checkFriend({ userA: data.userA, userB: data.userB }, function (dbRes) {
            if (dbRes.code === 1) { //双方互为好友，可以进行删除操作
                var sql_4 = "delete from friends WHERE uid = '" + dbRes.data[0].uid + "' and fid = '" + dbRes.data[0].fid + "'";
                _this.mMySqlConn.query(sql_4, function (err, results, fields) {
                    if (err) {
                        callback({ code: -1 });
                        console.error('DBHandle [REMOVE FRIEND ERR] - ', err.message);
                        return;
                    }
                    callback({ code: 1 });
                    console.log('DBHandle [REMOVE FRIEND SUC] - ', JSON.stringify(results));
                });
            }
            else {
                callback({ code: 0 });
            }
        });
    };
    /**检测是否是好友 */
    DBHandle.prototype.checkFriend = function (data, callback) {
        if (!this.checkSql())
            return;
        var sql = "select * from friends where (uid='" + data.userA + "' and fid='" + data.userB + "') or (uid='" + data.userB + "' and fid='" + data.userA + "')";
        this.mMySqlConn.query(sql, function (err, results, fields) {
            if (err) {
                callback({ code: -1 });
                console.error('DBHandle [CHECK FRIEND ERR] - ', err.message);
                return;
            }
            if (results.length >= 1) {
                callback({ code: 1, data: results });
                console.log("DBHandle [CHECK FRIEND SUC] - " + data.userA + " and " + data.userB + " is friend");
                return;
            }
            callback({ code: 0 });
            console.log("DBHandle [CHECK FRIEND FAIL] - " + data.userA + " and " + data.userB + " not friend");
        });
    };
    /**检测是否有好友申请记录 */
    DBHandle.prototype.checkReqFriend = function (data, callback) {
        if (!this.checkSql())
            return;
        var sql = "select * from reqfriends where requid='" + data.userA + "' and resuid='" + data.userB + "'";
        this.mMySqlConn.query(sql, function (err, results, fields) {
            if (err) {
                callback({ code: -1 });
                console.error('DBHandle [CHECK REQUEST FRIEND ERR] - ', err.message);
                return;
            }
            if (results.length >= 1) {
                callback({ code: 1, data: results });
                console.log("DBHandle [CHECK REQUEST FRIEND SUC] - " + data.userA + " and " + data.userB + " have record");
                return;
            }
            callback({ code: 0 });
            console.log("DBHandle [CHECK REQUEST FRIEND FAIL] - " + data.userA + " and " + data.userB + " not record");
        });
    };
    return DBHandle;
}());
exports.DBHandle = DBHandle;
var sql = new DBHandle();
