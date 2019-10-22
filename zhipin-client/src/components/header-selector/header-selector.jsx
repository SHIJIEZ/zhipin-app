/*
选择用户头像的UI组件
*/
import React, { Component } from "react";
import {
    Grid,
    List
} from "antd-mobile";
import propTypes from "prop-types"



class HeaderSelector extends Component {
    static propTypes = {
        setHeadPic: propTypes.func.isRequired
    }

    constructor() {
        super();
        this.headerList = []; // 头像待选数据
        for (let i = 0; i < 20; i++) {
            this.headerList.push({
                icon: require(`./images/头像${i + 1}.png`),
                text: `头像${i + 1}`
            })
        }
    }

    state = {
        icon: null, // 头像选中 默认null
        text: "", // 头像名称
    }

    headGridHandle = ({ icon, text }) => {
        this.setState({ icon, text });
        this.props.setHeadPic(text);
    }

    render() {
        const { icon, text } = this.state;
        const headerChecked = !icon ? "请选择头像" : (
            <div>已选择: <img src={icon} alt={text} /></div>
        )
        return (
            <List renderHeader={() => headerChecked}>
                <Grid data={this.headerList} onClick={this.headGridHandle}></Grid>
            </List>
        )
    }
}
export default HeaderSelector;