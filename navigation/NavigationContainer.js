import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import ShopNavigator from "./ShopNavigator";

// since we usually get this through props
import { NavigationActions } from "react-navigation";

const NavigationContainer = (props) => {
  // this allows to allow directly access an element in  JSX and add a red property to the shop navigator which allows connection
  const navRef = useRef();

  // the double bang operator forces th it to be true or false
  const isAuthorized = useSelector((state) => !!state.authentication.token);

  // this will automatically logout the app when the token is invalid / expires
  useEffect(() => {
    if (!isAuthorized) {
      /**
       * useRef has a current property
       * dispatch is a method made available by the shop navigator in which as a dispatch method through the navRef.current
       * this is a way to navigation inside the component even though it is outside the navigator
       */

      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Authentication" })
      );
    }
  }, [isAuthorized]);

  // now the shop navigator can have access to the redux store.
  return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;
