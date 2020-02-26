import React, { useEffect, useState } from "react";
import {
  SafeWrapper,
  PaddingView
} from "../../components/ui/containers/Containers";
import { Text, withTheme, Button } from "react-native-elements";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import GamesList from "../../components/game/game-list/GamesList";
import firebase from "@react-native-firebase/app";

const HomePage = ({ navigation, theme }) => {
  const [user, setUser] = useState("");

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

  useEffect(() => {
    const { currentUser } = firebase.auth();
    setUser(currentUser);
    return () => {};
  }, []);
  return (
    <SafeWrapper bg={theme.colors.lightShade}>
      {/* <GenerateExampleGames /> */}
      <PaddingView style={{ height: "100%" }}>
        <GamesList navigation={navigation} uid={user.uid} />
      </PaddingView>
    </SafeWrapper>
  );
};
export default withTheme(HomePage);
