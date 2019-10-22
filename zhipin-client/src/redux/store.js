import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import combineReducers from "./reducers";


export default createStore(combineReducers, composeWithDevTools(applyMiddleware(thunk)));