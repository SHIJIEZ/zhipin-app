import ajax from "./ajax";

// 注册接口
export const reqRegister = (userInfo) => ajax("/register", userInfo, "POST");
// 登录接口
export const reqLogin = (userInfo) => ajax("/login", userInfo, "POST");
// 更新用户信息
export const reqUpdateUser = (userInfo) => ajax("/improveuser", userInfo, "POST");
// 获取用户信息
export const reqGetUser = () => ajax("/getuser");
// 获取用户列表
export const reqUserList = (type) => ajax("/userlist", { type })
