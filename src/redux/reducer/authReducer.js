const initialState = {
  email: null,
  isAuthenticated: false,
  loading: true,
  role_user: false,
};


const authReducer = (state = initialState, action) => {
    switch(action.type){
        case "LOGIN_SUCCESS":
            return{
                ...state,
                email: action.payload.email,
                isAuthenticated: true,
                loading: false,
                role_user:action.payload.role,
            };

        case "LOGIN_FAILURE":
            return{
                ...state,
                email: null,
                isAuthenticated: false,
                loading: false,
                role_user: false,
            };

        case "TOKEN_EXPIRED":
            return{
                ...state,
                email: null,
                isAuthenticated: false,
                loading: false,
                role_user: false,
            };

        default:
            return state;
    }
}


export default authReducer;