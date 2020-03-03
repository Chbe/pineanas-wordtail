import React, { useState, useEffect } from "react";
import { withTheme, Button, Avatar, Text } from "react-native-elements";
import { logout } from "../../components/auth/AuthFunctions";
import firebase from "@react-native-firebase/app";
import {
  SafeWrapper,
  PaddingView,
  CenterView
} from "../../components/ui/containers/Containers";
import { View } from "react-native";
import TextField from "../../components/ui/controls/inputs/floating/FloatingInput";
import NotAnonymous from "./not-anonymous/NotAnonymous";
import Anonymous from "./anonymous/Anonymous";

const ProfilePage = ({ theme }) => {
  const [user, setUser] = useState({});
  const [fbUser, setFbUser] = useState({});

  const setUserInfo = async querySnapshot => {
    setFbUser(firebase.auth().currentUser);
    const userData = querySnapshot.data();
    if (userData) {
      setUser(userData);
    }
  };

  useEffect(() => {
    const uid = firebase.auth().currentUser.uid;
    const userRef = firebase.firestore().doc(`users/${uid}`);

    let unsubscribe = userRef.onSnapshot(setUserInfo);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeWrapper bg={theme.colors.lightShade}>
      <PaddingView>
        {fbUser && !fbUser.isAnonymous ? (
          <NotAnonymous user={user} />
        ) : (
          <Anonymous user={user} />
        )}
        <PaddingView>
          <Button title="Signout" onPress={() => logout()} />
        </PaddingView>
      </PaddingView>
    </SafeWrapper>
  );
};

export default withTheme(ProfilePage);
