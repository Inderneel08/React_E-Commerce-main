import axios from "axios";

// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

export const fetchCartCount = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost/laravel-backend/api/auth/getCartInfo", {
      withCredentials: true
    });

    dispatch({
      type: "UPDATE_CART_COUNT",
      payload: response.data.cartCount,
    });
  } catch (error) {
    dispatch({
      type: "UPDATE_CART_COUNT",
      payload: 0,
    });
  }
};

export const clearCart = () => {
    return{
        type:"CLEARCART",
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
        const response = await axios.post("http://localhost/laravel-backend/api/auth/login", {
            email,
            password
        }, {
            withCredentials: true
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


export const logoutForm = () => async(dispatch) =>{
    try {
        const response = await axios.post("http://localhost/laravel-backend/api/auth/logout",{},{
            withCredentials:true
        });

        dispatch({
            type: "LOGIN_FAILURE",
            payload: response.data, // Assuming API returns user data
        });

        return([response.data.message,response.status]);
    } catch (error) {
        dispatch({
            type: "LOGIN_FAILURE",
            payload: error.response.data, // Assuming API returns user data
        });
    }
}