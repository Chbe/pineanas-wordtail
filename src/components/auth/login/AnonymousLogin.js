import React from "react";
import { anonymousLogin } from "../AuthFunctions";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { Button } from "react-native-elements";

const AnonymousLogin = ({  }) => {
  const handleLogin = async () => {
    await anonymousLogin();
  };
  return (
    <Button
      icon={
        <FontAwesome5Icon
          style={{ marginRight: 10 }}
          color={"white"}
          size={24}
          name="user-secret"
        />
      }
      onPress={handleLogin}
      buttonStyle={{ backgroundColor: "#4e4e4e" }}
      title="Continue as guest"
    />
  );
};

export default AnonymousLogin;
