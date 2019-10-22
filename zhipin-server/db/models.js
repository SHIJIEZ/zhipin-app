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

// 向外暴露Model
exports.UserModel = UserModel;

