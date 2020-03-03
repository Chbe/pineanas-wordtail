import React from "react";
import { withTheme, Button } from "react-native-elements";
import { logout } from "../../components/auth/AuthFunctions";
import {
  SafeWrapper,
  PaddingView
} from "../../components/ui/containers/Containers";

const ProfilePage = ({ theme }) => {
  return (
    <SafeWrapper bg={theme.colors.lightShade}>
      {/* <GenerateExampleGames /> */}
      <PaddingView style={{ height: "100%" }}>
        <Button title="Signout" onPress={() => logout()} />
      </PaddingView>
    </SafeWrapper>
  );
};

export default withTheme(ProfilePage);
