/* 
注册路由组件
*/
import React, { Component } from "react";
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button
} from "antd-mobile";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Logo from "../../components/logo/logo";
import { register, cmpInnerModify } from "../../redux/actions"

const ListItem = List.Item;

class Register extends Component {
    state = {
        username: "",
        password: "",
        confirmPassword: "",
        type: "jobseeker"  // 求职者 招聘者
    }

    // 登录路由跳转
    toLogin = () => {
        this.props.cmpInnerModify({ msg: "" }); // 清除错误信息
        this.props.history.replace("/login");
    }

    // 用户注册信息收集
    registerInfoGahter = (infoType, v) => {
        this.setState({ [infoType]: v });
    }

    // 用户注册信息提交
    registerHandler = () => {
        this.props.register(this.state);
    }

    render() {
        const { msg, redircetTo } = this.props.user;
        if (redircetTo) { // 获取全局状态中的redircetTo 重定向到对应页面
            return (<Redirect to={redircetTo}></Redirect>)
        }

        const { type } = this.state;
        return (
            <div>
                <NavBar>人&nbsp;才&nbsp;招&nbsp;聘</NavBar>
                <Logo></Logo>
                <WingBlank>
                    <List>
                        {msg ? <div className="error-msg">{msg}</div> : null}
                        <WhiteSpace></WhiteSpace>
                        <InputItem placeholder="请输入用户名" onChange={v => this.registerInfoGahter("username", v)}>用户名：</InputItem>
                        <InputItem placeholder="请输入密码" onChange={v => this.registerInfoGahter("password", v)} type="password">密&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <InputItem placeholder="请确认密码" onChange={v => this.registerInfoGahter("confirmPassword", v)} type="password">确认密码：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <ListItem>
                            <span style={{ "marginRight": ".3rem" }}>我是</span>
                            <Radio checked={type === "jobseeker"} onChange={() => this.registerInfoGahter("type", "jobseeker")}>求职者</Radio>
                            &nbsp;&nbsp;
                            <Radio checked={type === "recruiter"} onChange={() => this.registerInfoGahter("type", "recruiter")} >招聘者</Radio>
                        </ListItem>
                        <WhiteSpace></WhiteSpace>
                        <Button type="primary" onClick={this.registerHandler}>注&nbsp;&nbsp;&nbsp;册</Button>
                        <Button onClick={this.toLogin}>已有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user }),
    { register, cmpInnerModify }
)(Register);