/*
求职者完善信息路由组件
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    NavBar,
    List,
    InputItem,
    Button
} from "antd-mobile";
import { Redirect } from "react-router-dom";
import { improveUser } from "../../redux/actions";

import HeaderSelector from "../../components/header-selector/header-selector";


class JobseekerInfo extends Component {
    state = {
        header: "", // 头像名称
        post: "", // 职位
        info: "", // 个人或公司简介
    }

    setHeadPic = (headtext) => {
        this.jobseekerInfoGahter("header", headtext)
    }

    // 求职者完善信息收集
    jobseekerInfoGahter = (infoType, v) => {
        this.setState({
            [infoType]: v
        })
    }

    // 求职者完善信息提交
    jobseekerInfoSubmit = () => {
        this.props.improveUser(this.state);
    }

    render() {
        const { header, type } = this.props.user;
        if (header && type) {
            const path = type === "jobseeker" ? "/jobseeker" : "recruiter";
            return (<Redirect to={path}></Redirect>)
        }
        return (
            <div>
                <NavBar>求职者信息完善</NavBar>
                <HeaderSelector setHeadPic={this.setHeadPic}></HeaderSelector>
                <List>
                    <InputItem placeholder="请输入求职岗位" onChange={(v) => this.jobseekerInfoGahter("post", v)}>求职岗位:</InputItem>
                    <InputItem placeholder="请输入个人介绍" onChange={(v) => this.jobseekerInfoGahter("info", v)}>个人介绍:</InputItem>
                </List>
                <Button type="primary" onClick={this.jobseekerInfoSubmit}>保存</Button>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user }),
    { improveUser }
)(JobseekerInfo);