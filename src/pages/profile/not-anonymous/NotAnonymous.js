import React, { useState, useEffect } from "react";
import { withTheme, Avatar, Button } from "react-native-elements";
import {
  CenterView,
  PaddingView
} from "../../../components/ui/containers/Containers";
import TextField from "../../../components/ui/controls/inputs/floating/FloatingInput";
import EditableAvatar from "../../../components/editable-avatar/EditableAvatar";
import { ProfileStore } from "../../../stores/ProfileStore";
import { updateUserInfo } from "../../../services/firebase/firestore/FBFirestoreService";

const NotAnonymous = ({ user, theme }) => {
  const { state, actions } = ProfileStore();

  const [profileUpdated, setProfileUpdated] = useState(false);

  const [savingData, setSavingData] = useState(false);

  const saveData = async () => {
    setSavingData(true);
    const updatedData = filterStateObj();
    await updateUserInfo(updatedData);
    setSavingData(false);
    setProfileUpdated(false);
    actions.clear();
  };
  const filterStateObj = () =>
    /** Filters out empty props */
    Object.keys(state).reduce(function(r, e) {
      if (!!state[e].length) r[e] = state[e];
      return r;
    }, {});

  useEffect(() => {
    if (
      state.photoURL.length ||
      state.username.length ||
      state.email.length ||
      state.displayName.length
    ) {
      setProfileUpdated(true);
    } else {
      setProfileUpdated(false);
    }
    return () => {};
  }, [state]);

  useEffect(() => {
    return () => {
      actions.clear();
    };
  }, []);

  return (
    <>
      <CenterView>
        <EditableAvatar actions={actions} user={user} />
      </CenterView>
      <PaddingView>
        <TextField
          baseColor={theme.colors.lightAccent}
          tintColor={theme.colors.lightAccent}
          label={user.username ? user.username : "Anonymous username"}
          value={state.username}
          onChangeText={name => actions.setUsername(name)}
        />
        <TextField
          baseColor={theme.colors.lightAccent}
          tintColor={theme.colors.lightAccent}
          label={user.displayName ? user.displayName : "Anonymous Name"}
          value={state.displayName}
          onChangeText={name => actions.setDisplayName(name)}
        />
        <TextField
          baseColor={theme.colors.lightAccent}
          tintColor={theme.colors.lightAccent}
          label={user.email ? user.email : "Anonymous Email"}
          value={state.email}
          onChangeText={email => actions.setEmail(email)}
        />
        <Button
          title="Save profile"
          disabled={!profileUpdated}
          loading={savingData}
          onPress={() => saveData()}
        />
      </PaddingView>
    </>
  );
};

export default withTheme(NotAnonymous);
