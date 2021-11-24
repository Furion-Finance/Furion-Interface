import { combineReducers } from "redux";
import furion from "./furionReducer";
import project from "./projectReducer";
import price from "./priceReducer";
export default combineReducers({furion, project, price});