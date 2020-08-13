export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";

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

    dispatch({ type: SIGNUP });
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

    dispatch({ type: LOGIN });
  };
};
