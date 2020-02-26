/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

import React, { Component, useState, useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { getTheme } from "./core/Themes";
import { PaddingView } from "./components/ui/containers/Containers";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import SplashScreen from "./pages/splashscreen/SplashScreen";
import CreateGamePage from "./pages/create-game/CreateGamePage";

import { ThemeProvider } from "react-native-elements";

const App = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const theme = getTheme("Shamrock");

  const Stack = createStackNavigator();

  const homeHeaderOptions = {
    headerStyle: { backgroundColor: theme.colors.primary },
    headerTitle: "",
    headerTintColor: theme.barStyle === "light-content" ? "#fff" : "#000"
  };

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
      <ThemeProvider theme={theme}>
        <SplashScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          {!user ? (
            <Stack.Screen name="Login" component={LoginPage} />
          ) : (
            <>
              <Stack.Screen
                name="Home"
                component={HomePage}
                options={homeHeaderOptions}
              />
              <Stack.Screen
                name="CreateGame"
                component={CreateGamePage}
                options={homeHeaderOptions}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
