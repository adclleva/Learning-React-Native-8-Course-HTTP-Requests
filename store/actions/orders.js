export const ADD_ORDER = "ADD_ORDER";

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch) => {
    const date = new Date(); // we create this so we can have the same time stamp to the backend and to the local app
    const response = await fetch(
      "https://rn-shop-app-1b7bc.firebaseio.com/orders/u1.json", // we'll be hitting the orders node with our user id
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(), // this will convert with the IOS standard
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    // this is also an async task
    const responseData = await response.json();
    console.log("addOrder: responseData ", responseData);

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: responseData.name, // this is generated from firebase
        items: cartItems,
        amount: totalAmount,
        date: date,
      },
    });
  };
};
