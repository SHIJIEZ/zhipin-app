/* 
主界面路由组件
*/
import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import RecruiterInfo from "../recruiter-info/recruiter-info";
import JobseekerInfo from "../jobseeker-info/jobseeker-info";

class Main extends Component {

    render() {
        const { user } = this.props;
        if (!user._id) {
            return (<Redirect to="/login"></Redirect>)
        }

        return (
            <div>
                <Switch>
                    <Route path="/recruiterinfo" component={RecruiterInfo}></Route>
                    <Route path="/jobseekerinfo" component={JobseekerInfo}></Route>
                </Switch>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user })
)(Main);