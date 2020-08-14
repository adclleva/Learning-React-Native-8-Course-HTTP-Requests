import React from "react"; // we need to import react since we are rendering a component with the JSX syntax
import {
  createAppContainer,
  createSwitchNavigator, // this is usually used for authentication since we don't want to go back when just logged in
} from "react-navigation";
import {
  createDrawerNavigator,
  DrawerNavigatorItems,
} from "react-navigation-drawer"; // this will be for the SideDrawer
import { createStackNavigator } from "react-navigation-stack";
import { Platform, SafeAreaView, Button, View } from "react-native";
import { useDispatch } from "react-redux";

import AuthenticationScreen from "../screens/user/AuthenticationScreen";
import CartScreen from "../screens/shop/CartScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import ProductsOverViewScreen from "../screens/shop/ProductOverviewScreen";
import StartupScreen from "../screens/StartupScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";

import * as authenticationActions from "../store/actions/authentication";

import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "#fff" : Colors.primary, // colors of the title
};

const ProductsNavigator = createStackNavigator(
  {
    // these are keys for the navigation identifiers
    ProductsOverView: ProductsOverViewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen, // this is included in the stack to navigate from the header cart icon
  },
  {
    navigationOptions: {
      // this is to have the icon be within the drawer
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    // the second argument is what configures the stack navigator
    defaultNavigationOptions: defaultNavigationOptions,
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
  },
  {
    navigationOptions: {
      // this is to have the icon be within the drawer
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavigationOptions,
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen,
  },
  {
    navigationOptions: {
      // this is to have the icon be within the drawer
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-create" : "ios-create"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavigationOptions,
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    // this allows us to add in our own content for the side drawer, where in the end it's a react component
    contentComponent: (props) => {
      const dispatch = useDispatch();

      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <DrawerNavigatorItems {...props} />
            <Button
              title="Logout"
              color={Colors.primary}
              onPress={() => {
                dispatch(authenticationActions.logout());
                // after we log off we go to the Authentication of login screen
                props.navigation.navigate("Authentication");
              }}
            />
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthenticationNavigator = createStackNavigator(
  {
    Authentication: AuthenticationScreen,
  },
  {
    defaultNavigationOptions: defaultNavigationOptions,
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen, // this will be the first thing that will be loaded
  Authentication: AuthenticationNavigator,
  Shop: ShopNavigator,
});

export default createAppContainer(MainNavigator); // we need to make sure to wrap our the navigation that we'll be using
