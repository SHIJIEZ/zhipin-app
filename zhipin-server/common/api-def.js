/*
接口地址描述
*/
const APIS_COLLEC = {
    register: { url: "/register" },
    login: { url: "/login" },
    improve: { url: "/improveuser", control: true },
    getuser: { url: "/getuser", control: true },
    userlist: { url: "/userlist" },
    msglist: {url:"/msglist", control:true},
    readedmsg: {url:"/readedmsg", control:true},

}

module.exports = APIS_COLLEC;
