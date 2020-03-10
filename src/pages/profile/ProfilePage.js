import React, { useState, useEffect } from "react";
import { withTheme, Button, Avatar, Text } from "react-native-elements";
import {
  SafeWrapper,
  PaddingView
} from "../../components/ui/containers/Containers";
import NotAnonymous from "./not-anonymous/NotAnonymous";
import Anonymous from "./anonymous/Anonymous";
import {
  logout,
  getCurrentUser
} from "../../services/firebase/auth/FBAuthService";
import { getUserRef } from "../../services/firebase/firestore/FBFirestoreService";

const ProfilePage = ({ theme }) => {
  const [user, setUser] = useState({});
  const [fbUser, setFbUser] = useState({});

  const setUserInfo = async querySnapshot => {
    setFbUser(getCurrentUser());
    const userData = querySnapshot.data();
    if (userData) {
      setUser(userData);
    }
  };

  useEffect(() => {
    let unsubscribe = getUserRef().onSnapshot(setUserInfo);
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
          <Button title="Signout" type="clear" onPress={() => logout()} />
        </PaddingView>
      </PaddingView>
    </SafeWrapper>
  );
};

export default withTheme(ProfilePage);
