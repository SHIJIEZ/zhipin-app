/*
对话聊天路由组件
 */
import React, { Component } from "react";
import { NavBar, List, InputItem, Grid, Icon } from "antd-mobile";
import { connect } from "react-redux";
import QueueAnim from "rc-queue-anim";

import "./css/index.less";
import { sendMsg, readedMsg } from "../../redux/actions";


const Item = List.Item

class Chat extends Component {

    constructor() {
        super();
        this.state = {
            content: ""
        }
    }
    sendMsgHandler = () => {
        let content;
        if (content = this.state.content.trim()) {
            let from = this.props.user._id;
            let to = this.props.match.params.userid;
            // 发送消息
            this.props.sendMsg({ content, from, to });
        }
        // 清除输入
        this.setState({
            content: "",
            emojisShow: false
        })
    }

    toggleEmojisShow = () => {
        const emojisShow = !this.state.emojisShow;
        this.setState({ emojisShow })
        if (emojisShow) {
            // 异步手动派发resize事件,解决表情列表显示的bug
            setTimeout(() => {
                window.dispatchEvent(new Event("resize"))
            }, 0)
        }
    }

    UNSAFE_componentWillMount() { // render前表情准备
        const emojis = [
            "😂", "😄", "😁", "😆", "😅", "😂", "😉", "😊", "😇", "😨", "😰", "😥", "😢", "😭",
            "😠", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "💋", "👋", "👍", "👎",
            "✊", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "😤", "😡", "💋", "👋", "👍", "👎"
        ]
        this.emojis = emojis.map(ej => ({ text: ej }));
    }

    componentDidMount() { // 初始化聊天信息 滑至最底部
        window.scrollTo(0, document.body.scrollHeight);
    }

    componentDidUpdate() { // 消息发送完成 滑至最底部
        window.scrollTo(0, document.body.scrollHeight);
    }

    componentWillMount() {   // 组件退出前更新未读消息的数量
        const from = this.props.match.params.userid;
        const to = this.props.user._id;
        this.props.readedMsg(from, to);
    }


    render() {
        const { user } = this.props;
        const { users, chatMsgs } = this.props.chatState;
        // 计算出chat_id
        const meId = user._id;
        if (!users[meId]) {
            return (
                <div style={{ marginTop: "50%", textAlign: "center" }}>
                    <h2>正在加载中....</h2>
                </div>
            )
        }

        const targetId = this.props.match.params.userid;
        const chat_id = [meId, targetId].sort().join("_");
        // 对chatMsg进行过滤 找到与当前用户的聊天记录
        const matchMsgs = chatMsgs.filter(msg => msg.chat_id === chat_id);
        // 对方头像
        const targetHedaerInfo = users[targetId].header;
        const targetHeaderIcon = targetHedaerInfo ? require(`../../assets/images/${targetHedaerInfo}.png`) : null;

        return (
            <div id="chat-page">
                <NavBar
                    icon={<Icon onClick={() => this.props.history.goBack()} type="left"></Icon>}
                    className="sticky-header"
                >
                    我与"{users[targetId].username}"的聊天
                </NavBar>
                <List style={{ marginTop: 45, marginBottom: 45 }}>
                    <QueueAnim type="right">
                        {
                            matchMsgs.map(msg => {
                                if (msg.from === meId) { // 自己发送给对方
                                    return (
                                        <Item key={msg._id} className="chat-me" extra={"我"}>
                                            {msg.content}
                                        </Item>
                                    )

                                } else { // 对方发送给自己
                                    return (
                                        <Item key={msg._id} thumb={targetHeaderIcon}>
                                            {msg.content}
                                        </Item>
                                    )
                                }
                            })
                        }
                    </QueueAnim>
                </List>

                <div className="am-tab-bar">
                    <InputItem
                        placeholder="请输入"
                        value={this.state.content}
                        onChange={v => this.setState({ content: v })}
                        onFocus={() => this.setState({ emojisShow: false })}
                        extra={
                            <div>
                                <span onClick={this.toggleEmojisShow} style={{ marginRight: 15 }}>😄</span>
                                <span onClick={this.sendMsgHandler} >发送</span>
                            </div>
                        }
                    />
                    {
                        this.state.emojisShow ? (
                            <Grid
                                data={this.emojis}
                                columnNum={8}
                                carouselMaxRow={4}
                                isCarousel={true}
                                onClick={(item) => {
                                    this.setState({ content: this.state.content + item.text })
                                }}
                            />
                        ) : null
                    }

                </div>
            </div >
        )
    }
}

export default connect(
    state => ({ user: state.user, chatState: state.chatState }),
    { sendMsg, readedMsg }
)(Chat)