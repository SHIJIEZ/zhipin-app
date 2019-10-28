/*
底部导航组件
*/
import React, { Component } from "react";
import { TabBar } from "antd-mobile";
import { withRouter } from "react-router-dom";
import propTypes from "prop-types";
import "./css/nav-footer.less"

const Item = TabBar.Item;

class NavFooter extends Component {
    static propTypes = {
        navList: propTypes.array.isRequired,
        unReadCount: propTypes.number.isRequired
    }

    render() {
        let { location, history, navList, unReadCount } = this.props;
        navList = navList.filter(nav => !nav.hide); // 过滤隐藏为ture的选项
        return (
            <TabBar>
                {
                    navList.map(nav => {
                        return (
                            <Item key={nav.path}
                                title={nav.text}
                                icon={{ uri: require(`./images/${nav.icon}.png`) }}
                                selectedIcon={{ uri: require(`./images/${nav.icon}-selected.png`) }}
                                selected={location.pathname === nav.path}
                                onPress={() => history.push(nav.path)}
                                badge={nav.path === "/message" ? unReadCount : 0}
                            >
                            </Item>
                        )
                    })
                }
            </TabBar>
        )
    }
}
export default withRouter(NavFooter);