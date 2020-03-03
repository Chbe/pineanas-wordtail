import React, { useState, useEffect } from "react";
import { withTheme, Button, Avatar } from "react-native-elements";
import { logout } from "../../components/auth/AuthFunctions";
import firebase from "@react-native-firebase/app";
import {
  SafeWrapper,
  PaddingView,
  CenterView
} from "../../components/ui/containers/Containers";
import { View } from "react-native";
import TextField from "../../components/ui/controls/inputs/floating/FloatingInput";

const ProfilePage = ({ theme }) => {
  const [user, setUser] = useState({});
  const [displayNameInputValue, setDisplayNameInputValue] = useState('');
  const [emailInputValue, setEmailInputValue] = useState('');

  useEffect(() => {
    const { currentUser } = firebase.auth();
    setUser(currentUser);
    return () => {
      //
    };
  }, []);

  return (
    <SafeWrapper bg={theme.colors.lightShade}>
      {/* <GenerateExampleGames /> */}
      <PaddingView>
        <CenterView>
          <Avatar
            size="large"
            rounded
            title={user.displayName && user.displayName[0]}
            source={user.photoURL ? { uri: user.photoURL } : null}
            showEditButton
          />
        </CenterView>
        <PaddingView
          style={{
            margin: 10,
            borderRadius: 10
          }}
        >
          <TextField
            baseColor={theme.colors.lightAccent}
            tintColor={theme.colors.lightAccent}
            label={user.displayName ? user.displayName : "Anonymous Name"}
            value={displayNameInputValue}
            onChangeText={name => setDisplayNameInputValue(name)}
          />
          <TextField
            baseColor={theme.colors.lightAccent}
            tintColor={theme.colors.lightAccent}
            label={user.email ? user.email : "Anonymous Email"}
            value={emailInputValue}
            onChangeText={email => setEmailInputValue(email)}
          />
        </PaddingView>
        <Button title="Signout" onPress={() => logout()} />
      </PaddingView>
    </SafeWrapper>
  );
};

export default withTheme(ProfilePage);
