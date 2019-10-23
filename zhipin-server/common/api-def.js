/*
接口地址描述
*/
const APIS_COLLEC = {
    register: { url: "/register" },
    login: { url: "/login" },
    improve: { url: "/improveuser", control: true },
    getuser: { url: "/getuser", control: true },
    userlist: { url: "/userlist" }
}

module.exports = APIS_COLLEC;
