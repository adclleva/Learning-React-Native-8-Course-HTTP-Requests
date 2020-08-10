import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Button,
  FlatList,
  Platform,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Item, HeaderButtons } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart"; // to get the action creators from Redux
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import * as productActions from "../../store/actions/product";

const ProductOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // it retrieves the state as input and returns whatever we want to get from there
  // we'll be pulling from the state of the products reducer
  const products = useSelector((state) => state.products.availableProducts);

  const dispatch = useDispatch();

  /**
   * this will initially be called when the component loads and to try again
   * and we use the useCallback hook so the function doesn't get re-created unnecessarily
   */
  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productActions.fetchProducts()); // we can do an await here since it returns a promise
    } catch (error) {
      setError(error.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      // we use the because loadProducts returns a promise because it's using async
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  // this will be a navigation listener when we navigate through the drawer
  useEffect(() => {
    // willFocus: emitted when screen comes into focus
    const willFocusSub = props.navigation.addListener("willFocus", () => {
      loadProducts();
    });

    // this will clean up the listener
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title, // we'll pass down the title for the navigation header
    });
  };

  // the ActivityIndicator from react-native will display until the fetching is finished
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
        <Button
          title="Try Again"
          color={Colors.primary}
          onPress={loadProducts}
        />
      </View>
    );
  }

  // the ActivityIndicator from react-native will display until the fetching is finished
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // this will show if the app was able to fetch data but the data is empty
  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts} // this function runs when you pull down on the FlatList
      refreshing={isRefreshing} // the refresh props allows us when to know that we are done, in this case we can use isLoading
      data={products} // this is the array that we'll be using
      keyExtractor={(item) => item.id} // this is for older versions of React
      renderItem={(itemData) => {
        const { item } = itemData;
        // itemData === { item, index, separators }, it gives you these props

        return (
          <ProductItem
            image={item.imageUrl}
            title={item.title}
            price={item.price}
            onSelect={() => {
              selectItemHandler(item.id, item.title);
            }}
          >
            <Button
              color={Colors.primary}
              title="View Details"
              onPress={() => {
                selectItemHandler(item.id, item.title);
              }}
            />
            <Button
              color={Colors.primary}
              title="To Cart"
              onPress={() => {
                dispatch(cartActions.addToCart(item)); // the item is the specific Product class
              }}
            />
          </ProductItem>
        );
      }}
    />
  );
};

// we switch over to a function because we're going to return and use the data that is being passed down
// with the navigationOptions to navigate to the CartScreen
ProductOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          // this will render a specific icon depending on the platform
          // we can go here to check out the icons https://icons.expo.fyi/
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            // this will open the side bar drawer
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          // this will render a specific icon depending on the platform
          // we can go here to check out the icons https://icons.expo.fyi/
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default ProductOverviewScreen;

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
