import React, { useState, useEffect, createRef } from "react";
import { Button, Input, Text } from "react-native-elements";
import { PaddingView } from "../../ui/containers/Containers";
import { View } from "react-native";
import { emailLogin } from "../../../services/firebase/auth/FBAuthService";

const EmailLogin = ({ theme }) => {
  const inputRef = createRef();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [registration, setRegistration] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordError2, setPasswordError2] = useState("");
  const [errorMessages, setErrorMessages] = useState("");

  const validate = () => {
    if (!email.length) {
      setEmailError("Unvalid email");
    }
    if (password.length < 6) {
      setPasswordError("Password must contain 6 or more characters");
    }
    if (registration && password !== password2) {
      setPasswordError2("Passwords don't match");
    }

    if (!emailError.length || !passwordError.length || !passwordError2.length) {
      return true;
    }
    return false;
  };

  const submit = async () => {
    setLoading(true);
    setErrorMessages("");
    setEmailError("");
    setPasswordError("");
    setPasswordError2("");

    if (validate() === true) {
      const res = await emailLogin(email, password, registration);
      if (res.hasOwnProperty("error")) {
        setErrorMessages(res.msg.trim());
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    return () => {};
  }, []);
  return (
    <View>
      <PaddingView padding={20}>
        {!!errorMessages.length && (
          <Text
            style={{
              backgroundColor: theme.colors.danger,
              color: "#fff",
              padding: 10
            }}
            onPress={() => setErrorMessages("")}
          >
            {errorMessages}
          </Text>
        )}
      </PaddingView>
      <PaddingView padding={10}>
        <Input
          autoCapitalize="none"
          ref={inputRef}
          placeholder="Email"
          autoCompleteType="email"
          keyboardType="email-address"
          errorMessage={emailError}
          onChangeText={txt => setEmail(txt)}
          value={email}
        />
      </PaddingView>
      <PaddingView padding={10}>
        <Input
          placeholder="Password"
          secureTextEntry
          autoCompleteType="password"
          errorMessage={passwordError}
          onChangeText={txt => setPassword(txt)}
          value={password}
        />
      </PaddingView>
      {registration && (
        <PaddingView padding={10}>
          <Input
            placeholder="Confirm password"
            secureTextEntry
            autoCompleteType="password"
            errorMessage={passwordError2}
            onChangeText={txt => setPassword2(txt)}
            value={password2}
          />
        </PaddingView>
      )}
      <PaddingView padding={10}>
        <Button
          type="clear"
          title={
            registration
              ? "I already have an account"
              : "I don't have an account"
          }
          onChangeText={txt => setPassword2(txt)}
          value={password2}
          onPress={() => setRegistration(!registration)}
        />
      </PaddingView>
      <PaddingView padding={10}>
        <Button
          title={registration ? "Register with email" : "Sign in with email"}
          loading={loading}
          onPress={submit}
        />
      </PaddingView>
    </View>
  );
};

export default EmailLogin;
