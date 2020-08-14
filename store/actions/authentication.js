// this can save data to the device for ios and android that would persists on relaunching of the app
import { AsyncStorage } from "react-native";

//* These two has been refactored with the Authenticate action
// export const SIGNUP = "SIGNUP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

export const authenticate = (userId, token) => {
  return {
    type: AUTHENTICATE,
    userId: userId,
    token: token,
  };
};

export const signup = (email, password) => {
  // this allows us to run an async action before we can dispatch our action to the store
  return async (dispatch) => {
    // this request allows us to create a new user
    const response = await fetch(
      // the Web API Key comes from the settings within the console of firebase
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCNR7x5xoe5yuk5eDgtZS7LryPjYJEyrmI",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResponseData = await response.json();
      const errorId = errorResponseData.error.message;

      let message = "Something went wrong!";

      if (errorId === "EMAIL_EXISTS") {
        message = "This email exists already!";
      }

      console.log("errorResponseData", errorResponseData);
      throw new Error(message);
    }

    const responseData = await response.json(); // this will unpack the response body and put it in json format

    console.log("responseData", responseData);

    //* This is what we used before the authentication action
    // dispatch({
    //   type: SIGNUP,
    //   token: responseData.idToken,
    //   userId: responseData.localId, // localId is the user id
    // });

    dispatch(authenticate(responseData.localId, responseData.idToken));

    /**
     * this is to check the expiration of the token
     * getTime return a number of milliseconds
     * we have to convert the the number which the ID token expires of
     * seconds into milliseconds and into an integer to get the expiration date
     * we wrap it into a Date object to not use a large millisecond number
     */
    const expirationDate = new Date(
      new Date().getTime() + parseInt(responseData.expiresIn) * 1000
    );
    console.log("expirationDate", expirationDate);
    saveDataToStorage(
      responseData.idToken,
      responseData.localId,
      expirationDate
    );
  };
};

export const login = (email, password) => {
  // this allows us to run an async action before we can dispatch our action to the store
  return async (dispatch) => {
    // this request allows us to login
    const response = await fetch(
      // the Web API Key comes from the settings within the console of firebase
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCNR7x5xoe5yuk5eDgtZS7LryPjYJEyrmI",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResponseData = await response.json();
      const errorId = errorResponseData.error.message;

      let message = "Something went wrong!";

      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "The password is invalid!";
      }

      console.log("errorResponseData", errorResponseData);
      throw new Error(message);
    }

    const responseData = await response.json(); // this will unpack the response body and put it in json format

    console.log("responseData", responseData);

    //* This is what we used before the authentication action
    // dispatch({
    //   type: LOGIN,
    //   token: responseData.idToken,
    //   userId: responseData.localId, // localId is the user id
    // });

    dispatch(authenticate(responseData.localId, responseData.idToken));

    /**
     * this is to check the expiration of the token
     * getTime return a number of milliseconds
     * we have to convert the the number which the ID token expires of
     * seconds into milliseconds and into an integer to get the expiration date
     * we wrap it into a Date object to not use a large millisecond number
     */
    const expirationDate = new Date(
      new Date().getTime() + parseInt(responseData.expiresIn) * 1000
    );
    console.log("expirationDate", expirationDate);
    saveDataToStorage(
      responseData.idToken,
      responseData.localId,
      expirationDate
    );
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

// we pass in the two pieces of data that we are interested in
const saveDataToStorage = (token, userId, expirationDate) => {
  /**
   * setItem is how we save data to the device
   * the item we need to set is a string
   * with the first parameter being the key and the second being the string that you want to save
   * hence why we do JSON.stringify() in order to convert the js object to a string
   */
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      // this will save the object as a string to the device
      token: token,
      userId: userId,
      expirationDate: expirationDate.toISOString(), // we convert this back to a ISO string format
    })
  );
};
