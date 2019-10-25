/*
招聘者路由组件
*/

import React, { Component } from "react";
import { connect } from "react-redux";

import UserList from "../../components/user-list/user-list";
import { getUserList } from "../../redux/actions";

class Recruiter extends Component {
    componentDidMount() {
        /*招聘者显示求职者列表*/
        this.props.getUserList("jobseeker");
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
)(Recruiter);