/*
对话聊天的路由组件
 */

import React, { Component } from 'react'
import { NavBar, List, InputItem, Grid, Icon } from 'antd-mobile'
import { connect } from 'react-redux';
import "./css/index.less";
import { sendMsg } from "../../redux/actions"


const Item = List.Item

class Chat extends Component {

    state = {
        content: ""
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
            content: ""
        })
    }

    render() {
        return (
            <div id='chat-page'>
                <NavBar>
                    aa
                </NavBar>
                <List style={{ marginTop: 50, marginBottom: 50 }}>
                    {/*alpha left right top bottom scale scaleBig scaleX scaleY*/}
                    <Item thumb={require("../../assets/images/头像10.png")}> 你好1</Item>
                    <Item thumb={require("../../assets/images/头像10.png")}>你好2 </Item>
                    <Item className="chat-me" extra={"我"}>呵呵</Item>

                </List>

                <div className='am-tab-bar'>
                    <InputItem
                        placeholder="请输入"
                        value={this.state.content}
                        onChange={v => this.setState({ content: v })}
                        extra={
                            <span onClick={this.sendMsgHandler}>发送</span>
                        }
                    />

                </div>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    { sendMsg }
)(Chat)