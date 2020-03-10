import React, { useState } from "react";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { Button } from "react-native-elements";
import { anonymousLogin } from "../../../services/firebase/auth/FBAuthService";

const AnonymousLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await anonymousLogin();
    setLoading(false);
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
      loading={loading}
      onPress={handleLogin}
      buttonStyle={{ backgroundColor: "#4e4e4e" }}
      title="Continue as guest"
    />
  );
};

export default AnonymousLogin;
