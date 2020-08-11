import React, { useReducer, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as authenticationActions from "../../store/actions/authentication";

const FORM_INPUT_UPDATE = "UPDATE";

// this is copied from the editproduct screen
const formReducer = (state, action) => {
  // the state comes from the useReducer
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues, // this copies the inputValues
      [action.input]: action.value, // we dynamically get the key/value of the input and update the value
    };

    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid, // this updates the validity of the input key
    };

    // we'll be checking out
    let updatedFormIsValid = true;

    /**
     * this will check for every key within the updatedValidities
     * to update the formIsValid
     */

    for (const key in updatedValidities) {
      if (!updatedValidities[key]) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key]; // if one key/value is false, then it will stay false
      }
    }

    return {
      ...state,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid,
    };
  }

  return state;
};

const AuthenticationScreen = (props) => {
  const dispatch = useDispatch();

  const signUpHandler = () => {
    dispatch(
      authenticationActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      )
    );
  };

  // this is initialized and similar to the useReducer in EditProductScreen
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      // these will be the input identifiers
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  /**
   * this will handle the text input changing and will use the useCallback to avoid rec-creating the function
   * because we get all the values from arguments
   */

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      /**
       * we are forwarding the input information that we are getting from the component
       * we dispatch this reducer to handle our complex local state
       */

      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={50}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry // this is to hide the text input
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Login"
                color={Colors.primary}
                onPress={signUpHandler} // this function is what we point at to execute the function
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Switch to Sign Up"
                color={Colors.accent}
                onPress={() => {}}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthenticationScreen.navigationOptions = {
  headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default AuthenticationScreen;
