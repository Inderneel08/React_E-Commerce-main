const initialState = {
  email: null,
  isAuthenticated: false,
  loading: true,
};


const authReducer = (state = initialState, action) => {
    switch(action.type){
        case "LOGIN_SUCCESS":
            return{
                ...state,
                email: action.payload.email,
                isAuthenticated: true,
                loading: false,
            };

        case "LOGIN_FAILURE":
            return{
                ...state,
                email: null,
                isAuthenticated: false,
                loading: false,
            };

        case "TOKEN_EXPIRED":
            return{
                ...state,
                email: null,
                isAuthenticated: false,
                loading: false,
            };

        default:
            return state;
    }
}


export default authReducer;