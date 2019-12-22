"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = require("mysql");
var dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '241659',
    port: 3306,
    database: 'doudizhu',
    multipleStatements: true
};
var DBHandle = /** @class */ (function () {
    function DBHandle() {
        this.mMySqlConnPool = mysql_1.createPool(dbConfig);
        this.register({ username: 'Tery', pwd: 'pvs241659' }, function (dbRes) {
            console.log(dbRes);
        });
    }
    /**获取连接对象 */
    DBHandle.prototype.getConnection = function (callback) {
        this.mMySqlConnPool.getConnection(function (err, mysqlConn) {
            if (err) {
                console.error("DBHandle [GET CONN ERR] - " + err);
                callback({ code: -1 });
            }
            else {
                callback({ code: 1, data: mysqlConn });
            }
        });
    };
    /**
     * 用户登陆，查询该用户是否存在
     * @param data 用户名和密码
     * @param callback 回调
     */
    DBHandle.prototype.loginIn = function (data, callback) {
        //TODO 检测用户名和密码是否符合规格（防sql注入）
        var query = function (dbRes) {
            if (dbRes.code === 1) { //获取到 mysqlConn 连接对象
                var sql_1 = "select * from users where username='" + data.username + "' and password='" + data.pwd + "'";
                dbRes.data.query(sql_1, sql_1, function (err, results, fields) {
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
                dbRes.data.release();
            }
            else {
                callback({ code: -1 });
            }
        };
        this.getConnection(query);
    };
    /**
     * 注册用户
     * @param data 用户名和密码
     * @param callback 回调
     */
    DBHandle.prototype.register = function (data, callback) {
        var _this = this;
        //TODO 检测用户名和密码是否符合规格（防sql注入）
        var self = this;
        var insertUserName = function (dbRes) {
            if (dbRes.code === 1) { //用户名没有重复
                self.insertUserInfo(data, function (dbRes) {
                    if (dbRes.code === 1) {
                        callback({ code: 1 });
                    }
                    else {
                        callback({ code: -1 });
                    }
                });
            }
            else {
                callback({ code: 0 });
            }
        };
        var query = function (dbRes) {
            if (dbRes.code === 1) {
                _this.checkUserName(data.username, insertUserName);
            }
            else {
                callback({ code: -1 });
            }
        };
        this.getConnection(query);
    };
    /**插入注册信息 */
    DBHandle.prototype.insertUserInfo = function (data, callback) {
        var query = function (dbRes) {
            if (dbRes.code === 1) {
                var sql_2 = "insert into users set ?";
                dbRes.data.query(sql_2, { username: data.username, password: data.pwd }, function (err, results, fields) {
                    if (err) {
                        callback({ code: -1 });
                        console.error('DBHandle [REGISTER ERR] - ', err.message);
                        return;
                    }
                    console.error('DBHandle [INSERT USER INFO SUC]');
                    callback({ code: 1 });
                });
                dbRes.data.release();
            }
            else {
                callback({ code: -1 });
            }
        };
        this.getConnection(query);
    };
    /**检测用户名是否能用（是否重复） */
    DBHandle.prototype.checkUserName = function (username, callback) {
        var query = function (dbRes) {
            if (dbRes.code === 1) {
                var sql_3 = "select * from users where username='" + username + "'";
                dbRes.data.query(sql_3, function (err, results, fields) {
                    if (err) {
                        callback({ code: -1 });
                        console.error('DBHandle [CHECK USER NAME ERR] - ', err.message);
                        return;
                    }
                    if (results.length >= 1) { //用户名已存在，注册失败
                        callback({ code: 0 });
                        console.log('DBHandle [CHECK USER NAME FAIL] - username already exist');
                        return;
                    }
                    //TODO 插入账号密码
                    callback({ code: 1 });
                });
                dbRes.data.release();
            }
            else {
                callback({ code: -1 });
            }
        };
        this.getConnection(query);
    };
    /**
     * 申请添加好友
     * @param data 发起申请的玩家、被申请的玩家
     * @param callback 回调
     */
    DBHandle.prototype.reqFriend = function (data, callback) {
        var self = this;
        var insertReq = function () {
            self.getConnection(function (dbRes) {
                if (dbRes.code === 1) {
                    var sql_4 = "insert into reqfriends set ?";
                    dbRes.data.query(sql_4, { requid: mysql_1.escape(data.reqUserName), resuid: mysql_1.escape(data.resUserName) }, function (err, results, fields) {
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
            });
        };
        var query = function (dbRes) {
            if (dbRes.code === 1) {
                var reqName = mysql_1.escape(data.reqUserName);
                var resName = mysql_1.escape(data.resUserName);
                var sqlCheckFriend = "select * from friends where (uid='" + reqName + "' and fid='" + resName + "') or (uid='" + resName + "' and fid='" + reqName + "')";
                var sqlCheckReq = "select * from reqfriends where requid='" + reqName + "' and resuid='" + resName + "'";
                dbRes.data.query(sqlCheckFriend + ";" + sqlCheckReq, function (err, results, fields) {
                    if (err) {
                        callback({ code: -1 });
                    }
                    else {
                        if (results[0].length === 0 && results[1].length === 0) { //不是好友并且没有好友申请记录
                            insertReq();
                        }
                        else {
                            callback({ code: 0 });
                        }
                    }
                });
                dbRes.data.release();
            }
            else {
                callback({ code: -1 });
            }
        };
        this.getConnection(query);
    };
    /**接受好友申请 */
    DBHandle.prototype.acceptFriend = function (data, callback) {
        var _this = this;
        //TODO 检测是否已经是好友
        this.checkFriend({ userA: data.reqUserName, userB: data.resUserName }, function (dbRes) {
            if (dbRes.code === 0) { //不是好友，可以进行添加
                _this.getConnection(function (dbRes) {
                    if (dbRes.code === 1) {
                        var sql_5 = "insert into friends set ?";
                        dbRes.data.query(sql_5, { uid: data.reqUserName, fid: data.resUserName }, function (err, results, fields) {
                            if (err) {
                                callback({ code: -1 });
                                console.error('DBHandle [ACCEPT FRIEND ERR] - ', err.message);
                                return;
                            }
                            callback({ code: 1 });
                            console.log('DBHandle [ACCEPT FRIEND SUC] - ', JSON.stringify(results));
                        });
                        dbRes.data.release();
                    }
                    else {
                        callback({ code: 0 });
                    }
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
        this.checkFriend({ userA: data.userA, userB: data.userB }, function (dbResCheck) {
            if (dbResCheck.code === 1) { //双方互为好友，可以进行删除操作
                _this.getConnection(function (dbResConn) {
                    if (dbResConn.code === 1) {
                        var sql_6 = "delete from friends WHERE uid = '" + dbResCheck.data[0].uid + "' and fid = '" + dbResCheck.data[0].fid + "'";
                        dbResConn.data.query(sql_6, function (err, results, fields) {
                            if (err) {
                                callback({ code: -1 });
                                console.error('DBHandle [REMOVE FRIEND ERR] - ', err.message);
                                return;
                            }
                            callback({ code: 1 });
                            console.log('DBHandle [REMOVE FRIEND SUC] - ', JSON.stringify(results));
                        });
                        dbResConn.data.release();
                    }
                    else {
                        callback({ code: 0 });
                    }
                });
            }
            else {
                callback({ code: 0 });
            }
        });
    };
    /**检测是否是好友 */
    DBHandle.prototype.checkFriend = function (data, callback) {
        var query = function (dbRes) {
            if (dbRes.code === 1) {
                var checkUserA = mysql_1.escape(data.userA);
                var checkUserB = mysql_1.escape(data.userB);
                var sql_7 = "select * from friends where (uid='" + checkUserA + "' and fid='" + checkUserB + "') or (uid='" + checkUserB + "' and fid='" + checkUserA + "')";
                dbRes.data.query(sql_7, function (err, results, fields) {
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
                dbRes.data.release();
            }
            else {
                callback({ code: -1 });
            }
        };
        this.getConnection(query);
    };
    return DBHandle;
}());
exports.DBHandle = DBHandle;
var sql = new DBHandle();
