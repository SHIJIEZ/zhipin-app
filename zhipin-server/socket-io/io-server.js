const { ChatModel } = require("../db/models");

module.exports = server => {
    const io = require("socket.io")(server)

    // 监视客户端与服务器的连接
    io.on("connection", (socket) => {
        console.log("【ws】有一个客户端连接上了服务器", socket.handshake.headers.origin);
        // 绑定监听 接收客户端发送的消息
        socket.on("sendMsg", ({ content, from, to }) => {
            console.log("【ws】接收到服务器发送的消息: ", { content, from, to });
            // 处理数据
            const chat_id = [from, to].sort().join("_");
            const create_time = Date.now();
            new ChatModel({ from, to, content, chat_id, create_time }).save((err, chatMsg) => {
                // 服务器向客户端发送消息
                io.emit("receiveMsg", chatMsg);
                console.log("【ws】服务器已向客户端回应消息: ", chatMsg);
            })


        })
    })
}