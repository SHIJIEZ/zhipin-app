import { combineReducers } from "redux";
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECIVE_USER,
    RESET_USER,
    CMP_IMMIT,
    RECIVE_USER_LIST
} from "./action-types.js";

import { getRedirectTo } from "../utils";

const initUser = {
    username: "", // 用户名
    type: "", // 用户类型   
    msg: "", // 错误提示信息
    redircetTo: ""
}
// 产生用户状态的reducer
function user(state = initUser, action) {
    switch (action.type) {
        case CMP_IMMIT:
            return { ...state, ...action.data }
        case AUTH_SUCCESS: // data为userInfo
            const { type, header } = action.data;
            return { ...state, ...action.data, redircetTo: getRedirectTo(type, header) }
        case ERROR_MSG: // data为msg
            return { ...state, msg: action.data }
        case RECIVE_USER:
            return { ...action.data }
        case RESET_USER:
            // 清除原有数据 附加错误信息
            return { ...initUser, msg: action.data }
        default:
            return state;
    }
}

const initUserList = []


// 产生信息列表展示的reducer
function userList(state = initUserList, action) {
    switch (action.type) {
        case RECIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}

// 暴露整合的reducers
export default combineReducers({
    user,
    userList
});