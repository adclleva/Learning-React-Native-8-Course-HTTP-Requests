import React, { useState } from "react";

// the boiler plate to connect the redux to the app
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { composeWithDevTools } from "redux-devtools-extension"; // this is for the react-native-debugger
import ReduxThunk from "redux-thunk";

import productsReducer from "./store/reducers/product";
import cartsReducer from "./store/reducers/cart";
import ordersReducer from "./store/reducers/orders";
import authenticationReducer from "./store/reducers/authentication";

import ShopNavigator from "./navigation/ShopNavigator";

// this connects the redux global state to the app
const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartsReducer,
  orders: ordersReducer,
  authentication: authenticationReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
); // make sure to remove the composeWithDevTools for production

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    // this controls if the fonts has loaded or not
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }
  return (
    <Provider store={store}>
      <ShopNavigator />
    </Provider>
  );
}
