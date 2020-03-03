import React from "react";
import { facebookLogin } from "../AuthFunctions";
import { Button } from "react-native-elements";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const FacebookLogin = ({ convertUser = false }) => {
  const handleLogin = async () => {
    await facebookLogin(convertUser);
  };
  return (
    <Button
      icon={
        <FontAwesome5Icon
          style={{ marginRight: 10 }}
          color={"white"}
          size={24}
          name="facebook"
        />
      }
      onPress={handleLogin}
      buttonStyle={{ backgroundColor: "#3b5998" }}
      title={`${convertUser ? "Link" : "Continue"} with Facebook`}
    />
  );
};

export default FacebookLogin;
