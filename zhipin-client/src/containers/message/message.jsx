/*
消息中心路由组件
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { List, Badge } from "antd-mobile";

const Item = List.Item;
const Brief = Item.Brief;

/*
    对chatMsgs按chat_id进行分组, 并得到每个组的lastMsg组成的数组
    找出每个聊天的lastMsg, 并用一个对象容器来保存 {chat_id, lastMsg}
    得到所有lastMsg的数组
    对数组进行排序(按create_time降序)
 */
const getLastMsgs = (chatMsgs, userid) => {
    // 找出每个聊天的lastMsg 并用一个对象容器来保存 {chat_id:lastMsg}
    const lastMsgObjs = {};
    chatMsgs.forEach(msg => {
        if (msg.to === userid && !msg.read) { // 未读消息统计
            msg.unReadCount = 1;
        } else {
            msg.unReadCount = 0;
        }

        // 得到msg的聊天标识id
        const chatId = msg.chat_id;
        // 获取已保存的当前组件的lastMsg
        let lastMsg = lastMsgObjs[chatId];
        if (!lastMsg) { // 首次没有将其假设为此聊天最后一次发送
            lastMsgObjs[chatId] = msg;
        } else {
            // 累加未读数量
            const unReadCount = lastMsg.unReadCount + msg.unReadCount;
            // 如果当前msg比存入的msg晚 则替换
            if (msg.create_time > lastMsg.create_time) {
                lastMsgObjs[chatId] = msg;
            }
            // 更新未读数量
            lastMsgObjs[chatId].unReadCount = unReadCount;
        }
    })

    // 得到所有lastMsg的数组
    const lastMsgs = Object.values(lastMsgObjs)
    // 对数组进行排序(按create_time降序)
    lastMsgs.sort((m1, m2) => {
        return m2.create_time - m1.create_time;
    })
    return lastMsgs;
}

class Message extends Component {

    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chatState;
        // 对chatMsgs按chat_id进行分组
        const lastMsgs = getLastMsgs(chatMsgs, user._id);

        if (lastMsgs.length === 0) {
            return (
                <div
                    style={{ marginTop: 50, marginBottom: 50, textAlign: "center", fontWeight: "bold" }}>
                    聊天列表为空, 快去聊聊吧..
                </div>
            )
        }

        return (
            <List style={{ marginTop: 50, marginBottom: 50 }}>

                {
                    lastMsgs.map(msg => {
                        // 得到目标用户的id
                        const targetUserId = msg.to === user._id ? msg.from : msg.to;
                        // 得到目标用户的信息
                        const targetUser = users[targetUserId];
                        return (
                            <Item
                                key={msg._id}
                                extra={<Badge text={msg.unReadCount} />}
                                thumb={targetUser.header ? require(`../../assets/images/${targetUser.header}.png`) : null}
                                arrow="horizontal"
                                onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
                            >
                                {msg.content}
                                <Brief>{targetUser.username}</Brief>
                            </Item>
                        )
                    })
                }
            </List>
        )
    }
}

export default connect(
    state => ({ user: state.user, chatState: state.chatState }),
    {}
)(Message)