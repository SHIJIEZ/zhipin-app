const SUCC_CODE = 1;
const FAILED_CODE = 0;
const PARAMS_ERR = "参数错误"
const DB_ERR = "数据库错误, 操作失败";
const USER_ALERADY_EXIST = "用户已存在";
const LOGIN_FAIL = "账号或密码错误, 登录失败";
const NOT_AUTH = "未认证状态, 操作失败";


function ResponseDataBuild(code, desc) {
    let ret = { code };
    if (!code) {
        ret.msg = desc;
        return ret

    }
    ret.data = desc;
    return ret
}


module.exports = {
    SUCC_CODE,
    FAILED_CODE,
    PARAMS_ERR,
    DB_ERR,
    USER_ALERADY_EXIST,
    LOGIN_FAIL,
    NOT_AUTH,
    ResponseDataBuild
}
