import React, { useState } from "react";
import { facebookLogin } from "../AuthFunctions";
import { Button } from "react-native-elements";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const FacebookLogin = ({ convertUser = false }) => {
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    await facebookLogin(convertUser);
    setLoading(false);
  };
  return (
    <Button
      loading={loading}
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
