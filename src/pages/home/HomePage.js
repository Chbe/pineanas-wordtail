import React from "react";
import { SafeWrapper, PaddingView } from "../../components/ui/containers/Containers";
import { Text, withTheme, Button } from "react-native-elements";
import { logout } from "../../components/auth/AuthFunctions";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const HomePage = ({ navigation, theme }, ...props) => {
  console.log(navigation)
  navigation.setOptions({
    headerLeft: () => (
      <PaddingView>
        <FontAwesome5Icon
          color={theme.barStyle === "light-content" ? "#fff" : "#000"}
          size={24}
          name="user-cog"
          onPress={() => alert("This is a button!")}
        />
      </PaddingView>
    ),
    headerRight: () => (
      <PaddingView>
        <FontAwesome5Icon
          color={theme.barStyle === "light-content" ? "#fff" : "#000"}
          size={24}
          name="plus-circle"
          onPress={() => navigation.navigate("CreateGame")}
        />
      </PaddingView>
    )
  });
  return (
    <SafeWrapper bg={theme.colors.lightShade}>
      <Text>HomePage</Text>
      <Button title="Signout" onPress={() => logout()}></Button>
    </SafeWrapper>
  );
};

export default withTheme(HomePage);
