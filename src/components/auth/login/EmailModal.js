import React, { useState, useEffect, createRef } from "react";
import styled from "styled-components";
import { CenterView } from "../../ui/containers/Containers";
import { Input, Button } from "react-native-elements";
import { emailLogin } from "../AuthFunctions";

const EmailModal = ({ theme }) => {
  const inputRef = createRef();
  const ModalContainer = styled(CenterView)`
    flex-direction: column;
    justify-content: space-around;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 22px;
    border-radius: 4;
  `;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [registration, setRegistration] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    setEmailError("");
    setPasswordError("");
    if (!email.length) {
      setEmailError("Unvalid email");
    }
    if (password.length < 6) {
      setPasswordError("Password must contain 6 or more characters");
    }
    if (registration && password !== password2) {
      setPasswordError("Passwords don't match");
    }

    if (emailError.length || passwordError.length) {
      return false;
    }
    return true;
  };

  const submit = () => {
    if (validate() === true) emailLogin(email, password);
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    return () => {};
  }, []);
  return (
    <ModalContainer>
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
      <Input
        placeholder="Password"
        secureTextEntry
        autoCompleteType="password"
        errorMessage={passwordError}
        onChangeText={txt => setPassword(txt)}
        value={password}
      />
      {registration && <Input placeholder="Confirm password" secureTextEntry />}
      <Button
        type="clear"
        title={
          registration ? "I already have an account" : "I don't have an account"
        }
        onChangeText={txt => setPassword2(txt)}
        value={password2}
        onPress={() => setRegistration(!registration)}
      />
      <Button title={registration ? "Register" : "Sign in"} onPress={submit} />
    </ModalContainer>
  );
};

export default EmailModal;
