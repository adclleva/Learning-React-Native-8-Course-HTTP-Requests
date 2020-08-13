import React, { useState, useReducer, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Button,
  ActivityIndicator,
  Alert,
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(); // have the error be undefined initially

  // this will determine wether we are in login or signup mode
  const [isSignup, setIsSignup] = useState(false);

  const dispatch = useDispatch();

  const authenticationHandler = async () => {
    let action;

    if (isSignup) {
      // these actions return a promise
      action = authenticationActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      // this action returns a promise
      action = authenticationActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }

    setError(null); // set the error to start as null before dispatching
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Shop");
    } catch (error) {
      setError(error.message); // we make sure to have the error message be set to the state
      setIsLoading(false);
    }
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

  useEffect(() => {
    if (error) {
      // this checks the state if there's an error
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]); // checks whenever error changes

  /**
   * this will handle the text input changing and will use the useCallback to avoid rec-creating the function
   * because we get all the values from arguments
   */

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      /**
       * we are forwarding the input information that we are getting from the component
       * we dispatch this reducer to handle our complex local state
       * we are getting some validation within the textChangeHandler within the Input UI component
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
              /**
               * we refactored the onInputChange prop because it will re-create a
               * function binding on ever render cycle
               * thus we need to have an id passed down instead
               * because the useCallback is not having an effect
               * to avoid an infinite rendering cycle whenever we use an anonymous
               * function or binding
               */
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address"
              // we remove the binding to prevent an infinite cycle since the arguments are coming from the component
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
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignup ? "Sign Up" : "Login"}
                  color={Colors.primary}
                  onPress={authenticationHandler} // this function is what we point at to execute the function
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
                color={Colors.accent}
                onPress={() => {
                  // this is the proper way to switch the previous state from false to true and vice versa
                  setIsSignup((prevState) => !prevState);
                }}
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
