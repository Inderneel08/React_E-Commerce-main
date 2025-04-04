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

        if(response.status==200){
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: response.data, // Assuming API returns user data
            });
        }

        return(response.data.message);

    } catch (error) {
        dispatch({
            type: "LOGIN_FAILURE",
            payload: email, // Assuming API returns user data
        });
    }

}