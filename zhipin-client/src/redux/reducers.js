import { combineReducers } from "redux";
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    CMP_IMMIT,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    RECEIVE_MSG_LIST_ERR,
    MSG_READED
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
        case RECEIVE_USER:
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
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}

const initChats = {
    users: {}, // 所有用户信息的对象 userid header
    chatMsgs: [], // 当前用户所有相关聊天信息的数组
    unReadCount: 0, // 消息总未读消息
    errMsg: "" // 错误信息
}
// 产生聊天状态的reducer
function chatState(state = initChats, action) {
    switch (action.type) {
        case RECEIVE_MSG_LIST:
            const { users, chatMsgs, userid } = action.data;
            return {
                users,
                chatMsgs,
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal + (!msg.read && msg.to === userid ? 1 : 0), 0),
                errMsg: ""
            }
        case RECEIVE_MSG_LIST_ERR:
            return { ...initChats, errMsg: action.data }

        case RECEIVE_MSG:
            const { chatMsg } = action.data;
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to === action.data.userid ? 1 : 0),
                errMsg: ""
            }
        case MSG_READED:
            const { from, to, count } = action.data
            state.chatMsgs.forEach(msg => {
                if (msg.from === from && msg.to === to && !msg.read) {
                    msg.read = true
                }
            })
            return {
                users: state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    if (msg.from === from && msg.to === to && !msg.read) { // 需要更新
                        return { ...msg, read: true }
                    } else {// 不需要
                        return msg
                    }
                }),
                unReadCount: state.unReadCount - count
            }

        default:
            return state;
    }
}


// 暴露整合的reducers
export default combineReducers({
    user,
    userList,
    chatState
});