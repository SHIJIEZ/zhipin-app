import { reqLogin, reqRegister, reqUpdateUser } from "../api/index";
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECIVE_USER,
    RESET_USER,
    CMP_IMMIT
} from "./action-types"

// 授权成功的同步action
const authSuccess = (userInfo) => ({ type: AUTH_SUCCESS, data: userInfo });
// 错误信息提示的同步action
const errorMsg = (errmsg) => ({ type: ERROR_MSG, data: errmsg });
// 更新成功的同步action
const reciveUser = (userInfo) => ({ type: RECIVE_USER, data: userInfo });
// 重置用户的同步action
const resetUser = (errmsg) => ({ type: RESET_USER, data: errmsg });
// 组件内部修改全局状态的同步action
const cmp_immit = (injectData) => ({ type: CMP_IMMIT, data: injectData });

// 组件内部修改全局状态
export const cmpInnerModify = (data) => {
    return dispatch => {
        dispatch(cmp_immit(data))
    }
}

export const register = (userInfo) => {
    const { username, password, confirmPassword } = userInfo;
    if (!username === "" || password === "" || confirmPassword === "") return errorMsg("不能有空的输入");
    if (password !== confirmPassword) return errorMsg("两次输入密码不一致");

    return async dispatch => {
        const response = await reqRegister(userInfo);
        const responseData = response.data;
        if (responseData.code === 1) {
            // 分发成功的同步action
            dispatch(authSuccess(responseData.data))
        } else {
            // 分发失败的同步action
            dispatch(errorMsg(responseData.msg))
        }
    }
}

export const login = (userInfo) => {
    const { username, password } = userInfo;
    if (!username === "" || password === "") return errorMsg("不能有空的输入");

    return async dispatch => {
        const response = await reqLogin(userInfo);
        const responseData = response.data;
        if (responseData.code === 1) {
            // 分发成功的同步action
            dispatch(authSuccess(responseData.data))
        } else {
            // 分发失败的同步action
            dispatch(errorMsg(responseData.msg))
        }
    }
}

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