const initialState = {
  email: null,
  isAuthenticated: false,
};


const authReducer = (state = initialState, action) => {
    switch(action.type){
        case "LOGIN_SUCCESS":
            return{
                ...state,
                email: action,
                isAuthenticated: true,
            };

        case "LOGIN_FAILURE":
            return{
                ...state,
                email: null,
                isAuthenticated: false,
            };

        case "TOKEN_EXPIRED":
            return{
                ...state,
                email: null,
                isAuthenticated: false,
            };

        default:
            return state;
    }
}


export default authReducer;