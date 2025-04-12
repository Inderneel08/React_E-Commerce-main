import handleCart from './handleCart'
import authReducer from './authReducer';
import { combineReducers } from "redux";
import cartReducer from './cartReducer';
const rootReducers = combineReducers({
    handleCart,
    auth:authReducer,
    cartCount:cartReducer
})
export default rootReducers