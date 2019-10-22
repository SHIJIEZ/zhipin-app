/*
招聘者完善信息路由组件
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    NavBar,
    List,
    InputItem,
    TextareaItem,
    Button
} from "antd-mobile";
import { Redirect } from "react-router-dom";
import { improveUser } from "../../redux/actions";

import HeaderSelector from "../../components/header-selector/header-selector";


class RecruiterInfo extends Component {
    state = {
        header: "", // 头像名称
        post: "", // 职位
        info: "", // 个人或公司简介
        company: "", // 公司名称
        salary: "", // 月薪
    }

    setHeadPic = (headtext) => {
        this.recruiterInfoGahter("header", headtext)
    }

    // 招聘者完善信息收集
    recruiterInfoGahter = (infoType, v) => {
        this.setState({
            [infoType]: v
        })
    }

    // 招聘者完善信息提交
    recruiterInfoSubmit = () => {
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
                <NavBar>招聘者信息完善</NavBar>
                <HeaderSelector setHeadPic={this.setHeadPic}></HeaderSelector>
                <List>
                    <InputItem placeholder="请输入招聘职位" onChange={(v) => this.recruiterInfoGahter("post", v)}>招聘职位:</InputItem>
                    <InputItem placeholder="请输入公司名称" onChange={(v) => this.recruiterInfoGahter("company", v)}>公司名称:</InputItem>
                    <InputItem placeholder="请输入职位薪资" onChange={(v) => this.recruiterInfoGahter("salary", v)}>职位薪资:</InputItem>
                </List>
                <TextareaItem title="职位要求:" rows={3} clear="true" onChange={(v) => this.recruiterInfoGahter("info", v)}></TextareaItem>
                <Button type="primary" onClick={this.recruiterInfoSubmit}>保存</Button>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user }),
    { improveUser }
)(RecruiterInfo);