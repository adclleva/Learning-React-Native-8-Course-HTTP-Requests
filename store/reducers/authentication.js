import { LOGIN, SIGNUP, AUTHENTICATE, LOGOUT } from "../actions/authentication";

const initialState = {
  token: null,
  userId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    // we need to store the token when logging in or signing up
    //* This is what we used before the authentication action
    // case LOGIN:
    //   return {
    //     token: action.token,
    //     userId: action.userId,
    //   };
    // case SIGNUP:
    //   return {
    //     token: action.token,
    //     userId: action.userId,
    //   };
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
      };

    case LOGOUT:
      // we make sure to reset the token and userId when we log out
      return initialState;
    default:
      return state;
  }
};
