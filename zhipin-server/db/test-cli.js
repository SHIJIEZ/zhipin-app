const mongoose = require("mongoose");
const md5 = require("blueimp-md5")

mongoose.connect("mongodb://localhost:27017/zhipin")
const conn = mongoose.connection;

conn.on("connected", () => {
    console.log("数据库连接成功~")
})

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true } // jobSeeker求职者 recruiter招聘者
})

const UserModel = mongoose.model("user", userSchema);


function testSave() {
    const userModel = new UserModel({
        username: "Tom1",
        password: md5("123"),
        type: "jobSeeker"
    });
    userModel.save((err, doc) => {
        console.log("save()", err, doc)
    })
}
// testSave()

function testFind() {
    UserModel.find((err, doc) => {
        console.log("find()", err, doc)
    })

    UserModel.findOne({ _id: "5dad68f1cd761d207880a86d" }, (err, doc) => {
        console.log(err, doc)
    })
}
// testFind()


function testUpdateById() {
    UserModel.findByIdAndUpdate({ _id: "5dad68f1cd761d207880a86d" }, { username: "Jack" }, (err, oldData) => {
        console.log(err, oldData)
    })
}
// testUpdateById()

function testDelete() {
    UserModel.remove({ _id: "5dad68f1cd761d207880a86d" }, (err, doc) => {
        console.log("remove()", err, doc); // { n: 1, ok: 1, deletedCount: 1 }
    })
}
// testDelete()
