/* 
主界面路由组件
*/
import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import { NavBar } from "antd-mobile";
import "./css/main.less"

import RecruiterInfo from "../recruiter-info/recruiter-info";
import JobseekerInfo from "../jobseeker-info/jobseeker-info";
import { getRedirectTo } from "../../utils/index";
import { getUser } from "../../redux/actions";
import Recruiter from "../recruiter/recruiter";
import Jobseeker from "../jobseeker/jobseeker";
import Message from "../message/message";
import Personal from "../personal/personal";
import NotFound from "../../components/not-found/not-found";
import NavFooter from "../../components/nav-footer/nav-footer";
import Chat from "../chat/chat";


class Main extends Component {
    constructor() {
        super();
        this.userid = Cookies.get("userid");
    }

    navList = [ // 包含所有导航组件的相关信息数据
        {
            path: '/recruiter', // 路由路径
            component: Recruiter,
            title: '大神列表',
            icon: 'dashen',
            text: '大神',
        },
        {
            path: '/jobseeker', // 路由路径
            component: Jobseeker,
            title: '老板列表',
            icon: 'laoban',
            text: '老板',
        },
        {
            path: '/message', // 路由路径
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息',
        },
        {
            path: '/personal', // 路由路径
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人',
        }
    ]

    componentDidMount() {
        // const userid = Cookies.get('userid');
        const { _id } = this.props.user;
        if (this.userid && !_id) {
            // 发送异步请求, 获取user
            this.props.getUser();
        }
    }

    componentWillUpdate() {
        this.userid = Cookies.get("userid");
    }
    render() {
        if (!this.userid) {
            return (<Redirect to="/login"></Redirect>)
        }

        const { user } = this.props;
        if (!user._id) {
            return null;
        } else {
            let path = this.props.location.pathname;
            if (path === "/") {
                path = getRedirectTo(user.type, user.header);
                return <Redirect to={path}></Redirect>
            }
        }

        const { navList } = this;
        const currPath = this.props.location.pathname;
        const currNav = navList.find(nav => nav.path === currPath);

        if (currNav) {
            // 底部只能显示三个选项 招聘者显示求职者 求职者显示招聘者
            user.type === "recruiter" ? navList[1].hide = true : navList[0].hide = true;
        }
        console.log("判断中...")
        return (
            <div>
                {currNav ? <NavBar className="sticky-header">{currNav.title}</NavBar> : null}
                <Switch>
                    {navList.map(nav => <Route path={nav.path} component={nav.component}></Route>)}
                    <Route path="/recruiterinfo" component={RecruiterInfo}></Route>
                    <Route path="/jobseekerinfo" component={JobseekerInfo}></Route>
                    <Route path="/chat/:userid" component={Chat}></Route>

                    <Route component={NotFound}></Route>
                </Switch>
                {currNav ? <NavFooter navList={navList}>底部导航</NavFooter> : null}
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    { getUser }
)(Main);