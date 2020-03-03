import React, { useState } from "react";
import { withTheme, Avatar } from "react-native-elements";
import { CenterView, PaddingView } from "../../../components/ui/containers/Containers";
import TextField from "../../../components/ui/controls/inputs/floating/FloatingInput";

const NotAnonymous = ({ user, theme }) => {
    const [usernameInputValue, setUsernameInputValue] = useState("");
    const [displayNameInputValue, setDisplayNameInputValue] = useState("");
    const [emailInputValue, setEmailInputValue] = useState("");
    
  return (
    <>
      <CenterView>
        <Avatar
          size="large"
          rounded
          title={user.displayName && user.displayName[0]}
          source={user.photoURL ? { uri: user.photoURL } : null}
          showEditButton
        />
      </CenterView>
      <PaddingView>
        <TextField
          baseColor={theme.colors.lightAccent}
          tintColor={theme.colors.lightAccent}
          label={user.username ? user.username : "Anonymous username"}
          value={usernameInputValue}
          onChangeText={name => setUsernameInputValue(name)}
        />
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
    </>
  );
};

export default withTheme(NotAnonymous);
