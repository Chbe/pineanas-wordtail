import React from "react";
import {
  SafeWrapper,
  PaddingView,
  CenterView
} from "../../components/ui/containers/Containers";
import { Text, withTheme } from "react-native-elements";
import AnonymousLogin from "../../components/auth/login/AnonymousLogin";
import FacebookLogin from "../../components/auth/login/FacebookLogin";

const LoginPage = ({ theme }) => {
  return (
    <SafeWrapper bg={theme.colors.lightShade}>
      <CenterView style={{ height: "100%", width: "100%" }}>
        <Text>TODO: Regular email/password login</Text>
        {/* <PaddingView padding={5}>
                      <EmailLogin navigation={navigation} />
                  </PaddingView> */}
        <PaddingView padding={5}>
          <FacebookLogin />
        </PaddingView>
        <PaddingView padding={5}>
          <AnonymousLogin />
        </PaddingView>
      </CenterView>
    </SafeWrapper>
  );
};

export default withTheme(LoginPage);
