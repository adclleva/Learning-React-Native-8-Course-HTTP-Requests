import PRODUCTS from "../../data/dummy-data";
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  SET_PRODUCTS,
} from "../actions/product";
import Product from "../../models/product";

const initialState = {
  availableProducts: [],
  userProducts: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts,
      };
    case CREATE_PRODUCT:
      // the ownerId is temporary
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );

      return {
        ...state,
        // concat allows to return a new array without manipulating the old one
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };

    case UPDATE_PRODUCT:
      // findIndex allows us to find an index of a certain element to update
      const productIndex = state.userProducts.findIndex(
        (product) => product.id === action.productId
      );

      const updatedProduct = new Product(
        action.productId,
        state.userProducts[productIndex].ownerId, // the owner id will not be changed
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productIndex].price // the price should not be editable
      );
      // we make sure to copy the existing user products
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct;

      // gets the index of the product within the availableProducts
      const availableProductIndex = state.availableProducts.findIndex(
        (product) => {
          return product.id === action.productId;
        }
      );
      // we make sure to copy the existing user products
      const updatedAvailableProducts = [...state.availableProducts];
      // this will replace the existing product with the updated one
      updatedAvailableProducts[availableProductIndex] = updatedProduct;

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.productId
        ),
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== action.productId
        ),
      };
  }
  return state;
};
