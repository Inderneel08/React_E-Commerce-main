const initialState = {
  cartCount: 0,
  cartLoading: true
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_CART_COUNT":
      return {
        ...state,
        cartCount: action.payload,
        cartLoading: false,
      };
    // case "RESET_CART":
    //   return {
    //     ...state,
    //     cartCount: 0,
    //     cartLoading: true,
    //   }

    // ...other cases
    default:
      return state;
  }
};

export default cartReducer;
