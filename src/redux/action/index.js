import axios from "axios";

// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}

export const submitLoginForm = (email,password) => async(dispatch) => {

    try {
        const response = await axios.post("http://localhost:5000/api/auth/login", {
            email,
            password,
        });

        dispatch({
            type: "LOGIN_SUCCESS",
            payload: response.data, // Assuming API returns user data
        });

        return([response.data.message,response.status]);
    } catch (error) {
        dispatch({
            type: "LOGIN_FAILURE",
            payload: error.response.data, // Assuming API returns user data
        });

        return([error.response.data.message,error.response.status]);
    }

}