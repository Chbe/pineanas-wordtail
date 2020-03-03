import React from "react";
import { facebookLogin } from "../AuthFunctions";
import { Button } from "react-native-elements";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const FacebookLogin = ({ navigation }) => {
  const handleLogin = async () => {
    await facebookLogin();
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
      title="Continue with Facebook"
    />
  );
};

export default FacebookLogin;
