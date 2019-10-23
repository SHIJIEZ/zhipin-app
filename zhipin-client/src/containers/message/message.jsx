/*
消息中心路由组件
*/
import React, { Component } from "react";
import { connect } from "react-redux";

class Message extends Component {
    render() {
        return (
            <div>消息中心</div>
        )
    }
}
export default connect(
    state => ({}),
    {}
)(Message);