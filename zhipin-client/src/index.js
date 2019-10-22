import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./redux/store";
import Login from "./containers/login/login";
import Register from "./containers/register/register";
import Main from "./containers/main/main";
import "./assets/css/index.less";

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path="/login" exact component={Login}></Route>
                <Route path="/register" exact component={Register}></Route>
                <Route component={Main}></Route> {/* 默认组件*/}
            </Switch>
        </HashRouter>
    </Provider>,
    document.getElementById("root")
)