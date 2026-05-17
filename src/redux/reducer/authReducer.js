const initialState = {
  isAuthenticated: false,
  token: null,
  loading: true,
  role_user: false,
};


const authReducer = (state = initialState, action) => {
    console.log(action);
    switch(action.type){
        case "LOGIN_SUCCESS":
            return{
                ...state,
                isAuthenticated: true,
                loading: false,
                role_user:action.payload.role,
            };

        case "LOGIN_FAILURE":
            return{
                ...state,
                isAuthenticated: false,
                loading: false,
                role_user: false,
            };

        case "TOKEN_EXPIRED":
            return{
                ...state,
                isAuthenticated: false,
                loading: false,
                role_user: false,
            };

        default:
            return state;
    }
}


export default authReducer;