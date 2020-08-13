import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";
import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import * as authenticationActions from "../store/actions/authentication";

const StartupScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // we'll check the async storage for a valid token
    const tryLogin = async () => {
      // this will get the value using the key we used for setItem by using getItem
      const userData = await AsyncStorage.getItem("userData"); // all asyncstorage is asynchronous and will return a promise

      // if the user hasn't been logged in and can't find the token
      if (!userData) {
        props.navigation.navigate("Authentication");
        return;
      }

      // this parses a string JSON format and converts it to a js object or array
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;

      const expirationDate = new Date(expiryDate);

      // new Date() is the current timestamp and checks if expirationDate is in the past
      if (expirationDate <= new Date() || !token || !userId) {
        props.navigation.navigate("Authentication");
        return;
      }

      props.navigation.navigate("Shop");
      // after the token has passed, we need to lock the user in to get the auto-login feature in
      dispatch(authenticationActions.authenticate(userId, token));
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

export default StartupScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
