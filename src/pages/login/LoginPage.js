import React from "react";
import {
  SafeWrapper,
  PaddingView,
  CenterView
} from "../../components/ui/containers/Containers";
import { Text, withTheme } from "react-native-elements";
import AnonymousLogin from "../../components/auth/login/AnonymousLogin";
import FacebookLogin from "../../components/auth/login/FacebookLogin";
import EmailLogin from "../../components/auth/login/EmailLogin";
import { View } from "react-native";

const LoginPage = ({ theme }) => {
  return (
    <SafeWrapper bg={theme.colors.lightShade}>
      <CenterView style={{ height: "100%", width: "100%" }}>
        <View style={{ width: "100%" }}>
          <PaddingView padding={5}>
            <EmailLogin theme={theme} />
          </PaddingView>
          <PaddingView padding={20}>
            <Text style={{ color: theme.colors.primary, fontSize: 20, textAlign: "center" }}>
              or
            </Text>
          </PaddingView>
          <PaddingView padding={5}>
            <FacebookLogin />
          </PaddingView>
          <PaddingView padding={5}>
            <AnonymousLogin />
          </PaddingView>
        </View>
      </CenterView>
    </SafeWrapper>
  );
};

export default withTheme(LoginPage);
