export const SIGN_UP = "SIGN_UP";

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
      throw new Error("Something went wrong!");
    }

    const responseData = await response.json(); // this will unpack the response body and put it in json format

    console.log("responseData", responseData);

    dispatch({ type: SIGN_UP });
  };
};
