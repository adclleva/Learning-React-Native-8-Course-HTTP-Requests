export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";

export const deleteProduct = (productId) => {
  return {
    type: DELETE_PRODUCT,
    productId: productId,
  };
};

// we can create the product within the action/reducer side
export const createProduct = (title, description, imageUrl, price) => {
  // we'll use the es6 async await for promises
  return async (dispatch) => {
    /**
     *  this is a redux-thunk pattern where we can run any async code
     * we add .json to the request because that's a firebase specific thing
     */
    const response = await fetch(
      "https://rn-shop-app-1b7bc.firebaseio.com/products.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
        }),
      }
    );

    // this is also an async task
    const responseData = await response.json();

    console.log("responseData", responseData);

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: responseData.name, // this coming from firebase when we do a post to the rest api
        title,
        description,
        imageUrl,
        price,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return {
    type: UPDATE_PRODUCT,
    productId: id,
    productData: {
      title,
      description,
      imageUrl,
    },
  };
};
