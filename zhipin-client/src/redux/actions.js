import { reqLogin, reqRegister, reqUpdateUser, reqGetUser, reqUserList, reqChatMsgList } from "../api/index";
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    CMP_IMMIT,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    RECEIVE_MSG_LIST_ERR
} from "./action-types";
import clientIO from "socket.io-client";


// 授权成功的同步action
const authSuccess = (userInfo) => ({ type: AUTH_SUCCESS, data: userInfo });
// 错误信息提示的同步action
const errorMsg = (errmsg) => ({ type: ERROR_MSG, data: errmsg });
// 更新成功的同步action
const reciveUser = (userInfo) => ({ type: RECEIVE_USER, data: userInfo });
// 重置用户的同步action
export const resetUser = (errmsg) => ({ type: RESET_USER, data: errmsg });
// 组件内部修改全局状态的同步action
const cmp_immit = (injectData) => ({ type: CMP_IMMIT, data: injectData });
// 接受用户列表成功的同步action
const reciveUserList = (data) => ({ type: RECEIVE_USER_LIST, data: data });
// 接收消息列表的同步action
const receiveMsgList = ({ users, chatMsgs }) => ({ type: RECEIVE_MSG_LIST, data: { users, chatMsgs } });
// 接收一条消息的同步action
const receiveMsg = (chatMsg) => ({ type: RECEIVE_MSG, data: chatMsg });
// 接收消息错误的同步action
const receiveMsgListErr = (msg) => ({ type: RECEIVE_MSG_LIST_ERR, data: msg });


// 初始化wssocket对象
const initClientIO = (dispatch, userid) => {
    if (!clientIO.socket) {
        clientIO.socket = clientIO("ws://localhost:4000");
        // 绑定监听, 接收服务器发送的消息
        clientIO.socket.on("receiveMsg", (chatMsg) => {
            if (chatMsg.to === userid || chatMsg.from === userid) { // 服务器为全局分发 属于自身的才进行接收
                dispatch(receiveMsg(chatMsg))
            }
        })
    }
}

// 异步获取聊天消息列表数据
const getChatMsgList = async (dispatch, userid) => {
    initClientIO(dispatch, userid); // 初始化socket客户端
    const response = await reqChatMsgList();
    const responseData = response.data;
    if (responseData.code === 1) {
        // 分发同步action
        const { users, chatMsgs } = responseData.data;
        dispatch(receiveMsgList({ users, chatMsgs }));
    } else {
        // 失败
        dispatch(receiveMsgListErr(responseData.msg));
    }
}


// 聊天发送消息action
export const sendMsg = ({ content, from, to }) => {
    return async dispatch => {
        console.log("发送消息：", { content, from, to })
        clientIO.socket.emit("sendMsg", { content, from, to });
    }
}

// 组件内部修改全局状态
export const cmpInnerModify = (data) => {
    return dispatch => {
        dispatch(cmp_immit(data))
    }
}

// 用户注册异步action
export const register = (userInfo) => {
    const { username, password, confirmPassword } = userInfo;
    if (!username === "" || password === "" || confirmPassword === "") return errorMsg("不能有空的输入");
    if (password !== confirmPassword) return errorMsg("两次输入密码不一致");

    return async dispatch => {
        const response = await reqRegister(userInfo);
        const responseData = response.data;
        if (responseData.code === 1) {
            // 分发成功的同步action
            getChatMsgList(dispatch, responseData.data._id); // 获取消息列表
            dispatch(authSuccess(responseData.data))
        } else {
            // 分发失败的同步action
            dispatch(errorMsg(responseData.msg))
        }
    }
}

// 用户登录异步action
export const login = (userInfo) => {
    const { username, password } = userInfo;
    if (!username === "" || password === "") return errorMsg("不能有空的输入");

    return async dispatch => {
        const response = await reqLogin(userInfo);
        const responseData = response.data;
        if (responseData.code === 1) {
            // 获取消息列表
            getChatMsgList(dispatch, responseData.data._id); // 获取消息列表
            // 分发成功的同步action
            dispatch(authSuccess(responseData.data))
        } else {
            // 分发失败的同步action
            dispatch(errorMsg(responseData.msg))
        }
    }
}
// 完善用户信息异步action
export const improveUser = (userInfo) => {
    return async dispatch => {
        const response = await reqUpdateUser(userInfo);
        const responseData = response.data;
        if (responseData.code === 1) {
            // 更新成功 分发action
            dispatch(reciveUser(responseData.data))
        } else {
            // 更新失败 分发action
            dispatch(resetUser(responseData.msg))
        }
    }
}

// 获取用户信息异步action
export const getUser = () => {
    return async dispatch => {
        const response = await reqGetUser();
        const responseData = response.data;
        if (responseData.code === 1) {
            getChatMsgList(dispatch, responseData.data._id); // 获取消息列表
            dispatch(reciveUser(responseData.data))
        } else {
            dispatch(resetUser(responseData.msg))
        }
    }
}

// 获取用户列表的异步action
export const getUserList = (type) => {
    return async dispatch => {
        const response = await reqUserList(type);
        const responseData = response.data;
        if (responseData.code === 1) {
            dispatch(reciveUserList(responseData.data))
        } else {
            dispatch(errorMsg(responseData.msg))
        }
    }
}
