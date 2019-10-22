/*
工具包
*/

// 获取注册重定向路由
function registerRedirect(type, headContent) {
    let path;
    type === "jobseeker" ? path = "/jobseeker" : path = "/recruiter";
    !headContent ? path += "info" : path = path;
    return path
}

export {
    registerRedirect
}