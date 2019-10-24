const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/zhipin")
const coon = mongoose.connection;

coon.on("connected", () => console.log("mongodb数据库连接成功"));

// 定义用户注册文档描述结构
const userSchema = mongoose.Schema({
    username: { type: String, required: true }, // 账号
    password: { type: String, required: true }, // 密码
    type: { type: String, required: true }, // jobseeker求职者 recruiter招聘者
    header: { type: String }, // 头像名称
    post: { type: String }, // 职位
    info: { type: String }, // 个人或公司简介
    company: { type: String }, // 公司名称
    salary: { type: String } // 月薪
});

// 定义Model 可操作对应集合
const UserModel = mongoose.model("user", userSchema);


// 定义chats集合的文档结构
const chatSchema = mongoose.Schema({
    from: { type: String, required: true }, // 发送用户的id
    to: { type: String, required: true }, // 接收用户的id
    chat_id: { type: String, required: true }, // from和to组成的字符串
    content: { type: String, required: true }, // 内容
    read: { type: Boolean, default: false }, // 标识是否已读
    create_time: { type: Number } // 创建时间
})
// 定义能操作chats集合数据的Model
const ChatModel = mongoose.model('chat', chatSchema) // 集合为: chats




exports.UserModel = UserModel;
exports.ChatModel = ChatModel

