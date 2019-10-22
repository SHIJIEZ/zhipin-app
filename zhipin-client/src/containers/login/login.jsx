/* 
登录路由组件
*/
import React, { Component } from "react";
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Button
} from "antd-mobile";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Logo from "../../components/logo/logo";
import { login, cmpInnerModify } from "../../redux/actions";


class Login extends Component {
    state = {
        username: "",
        password: "",
    }
    // 注册路由跳转
    toRegister = () => {
        this.props.cmpInnerModify({ msg: "" }); // 清除错误信息
        this.props.history.replace("/register")
    }

    // 用户登录信息收集
    loginInfoGahter = (infoType, v) => {
        if (!v) return;
        this.setState({ [infoType]: v });
    }

    // 用户登录信息提交
    loginHandler = () => {
        this.props.login(this.state);
    }

    render() {
        const { msg, redircetTo } = this.props.user;
        if (redircetTo) { // 获取全局状态中的redircetTo 重定向到对应页面
            return (<Redirect to={redircetTo}></Redirect>)
        }
        return (
            <div>
                <NavBar>人&nbsp;才&nbsp;招&nbsp;聘</NavBar>
                <Logo></Logo>
                <WingBlank>
                    <List>
                        {msg ? <div className="error-msg">{msg}</div> : null}
                        <WhiteSpace></WhiteSpace>
                        <InputItem placeholder="请输入用户名" onChange={v => this.loginInfoGahter("username", v)}>用户名：</InputItem>
                        <InputItem placeholder="请输入密码" onChange={v => this.loginInfoGahter("password", v)} type="password">密&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <Button type="primary" onClick={this.loginHandler}>登&nbsp;&nbsp;&nbsp;录</Button>
                        <Button onClick={this.toRegister}>去注册</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user }),
    { login, cmpInnerModify }
)(Login);