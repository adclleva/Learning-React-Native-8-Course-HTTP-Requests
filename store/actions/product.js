import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

// we'll be fetching products from the api
export const fetchProducts = () => {
  return async (dispatch) => {
    /**
     * we use a try catch block to handle the fetching errors
     */
    try {
      const response = await fetch(
        "https://rn-shop-app-1b7bc.firebaseio.com/products.json",
        {
          /**
           * it is default as a GET request
           * we don't need any headers or a body
           */
        }
      );

      if (!response.ok) {
        // checks if response is within the http 200 status range
        throw new Error("Something went wrong!");
      }

      // this is also an async task
      const responseData = await response.json();
      /** an example of the object
        responseData Object {
          "-MDmXa2_qTG7EOPBs-Wm": Object {
            "description": "Medieval Axe",
            "imageUrl": "http://www.hbforge.com/images/products/preview/340-300.jpg",
            "price": 9000,
            "title": "Axe",
          },
        }
       */

      const loadedProducts = []; // we initialize this empty array to get each item from the response object

      for (const key in responseData) {
        // we look through the response object and create a new product
        loadedProducts.push(
          new Product(
            key,
            "u1",
            responseData[key].title,
            responseData[key].imageUrl,
            responseData[key].description,
            responseData[key].price
          )
        );
      }
      dispatch({ type: SET_PRODUCTS, products: loadedProducts });
    } catch (error) {
      // send to custom analytics server
      throw error;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().authentication.token;

    const response = await fetch(
      `https://rn-shop-app-1b7bc.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        // we can also do PUT as well to completely overwrite the data
        method: "DELETE",
      }
    );

    // this would create an error for the try catch block within the editproduct screen
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: DELETE_PRODUCT,
      productId: productId,
    });
  };
};

// we can create the product within the action/reducer side
export const createProduct = (title, description, imageUrl, price) => {
  // we'll use the es6 async await for promises
  return async (dispatch, getState) => {
    const token = getState().authentication.token;
    /**
     *  this is a redux-thunk pattern where we can run any async code
     * we add .json to the request because that's a firebase specific thing
     */
    const response = await fetch(
      `https://rn-shop-app-1b7bc.firebaseio.com/products.json?auth=${token}`,
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
  /**
   * the second argument we pass in is a function which allows us to get
   * the redux global state thanks to the thunk middleware
   */
  return async (dispatch, getState) => {
    const token = getState().authentication.token;

    const response = await fetch(
      // the ?access_token= at the end of the url authenticates with an access token
      `https://rn-shop-app-1b7bc.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH", // we can also do PUT as well to completely overwrite the data
        headers: {
          "Content-Type": "application/json",
        },
        // firebase will only change the fields of the body
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    // this would create an error for the try catch block within the editproduct screen
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      productId: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};
