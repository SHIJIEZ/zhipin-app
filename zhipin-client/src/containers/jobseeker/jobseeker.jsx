/*
求职者路由组件
*/
import React, { Component } from "react";
import { connect } from "react-redux";

import UserList from "../../components/user-list/user-list";
import { getUserList } from "../../redux/actions";

class Jobseeker extends Component {
    componentDidMount() {
        /*求职者显示招聘者列表*/
        this.props.getUserList("recruiter")
    }
    
    render() {
        return (
            <UserList userList={this.props.userList}></UserList>
        )
    }
}
export default connect(
    state => ({ userList: state.userList }),
    { getUserList }
)(Jobseeker);