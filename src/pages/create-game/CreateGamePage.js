import React from "react";
import { SafeWrapper } from "../../components/ui/containers/Containers";
import { Text, withTheme } from "react-native-elements";

const CreateGamePage = ({ navigation, theme }) => {
  return (
    <SafeWrapper bg={theme.colors.lightShade}>
      <Text>Greate Game</Text>
    </SafeWrapper>
  );
};

export default withTheme(CreateGamePage);
