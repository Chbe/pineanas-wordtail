import { Avatar, Button, withTheme } from 'react-native-elements';
import {
  CenterView,
  PaddingView,
} from '../../../components/ui/containers/Containers';
import React, { useEffect, useState } from 'react';
import {
  setUniqueUsername,
  updateUserInfo,
} from '../../../services/firebase/firestore/FBFirestoreService';

import EditableAvatar from '../../../components/editable-avatar/EditableAvatar';
import TextField from '../../../components/ui/controls/inputs/floating/FloatingInput';
import { minUsernameLength } from '../../../const/Const';
import { useProfileContext } from '../../../stores/ProfileStore';

const NotAnonymous = ({ user, theme }) => {
  const { state, actions } = useProfileContext();

  const [profileUpdated, setProfileUpdated] = useState(false);

  const [savingData, setSavingData] = useState(false);

  const saveData = async () => {
    setSavingData(true);
    const updatedData = filterStateObj();
    const passedValidation = await validateData(updatedData);
    if (passedValidation === true) {
      await updateUserInfo(updatedData);
      setProfileUpdated(false);
      actions.clear();
    } else {
      alert(passedValidation.msg);
    }
    setSavingData(false);
  };
  const filterStateObj = () =>
    /** Filters out empty props */
    Object.keys(state).reduce(function(r, e) {
      if (!!state[e].length) r[e] = state[e];
      return r;
    }, {});

  const validateData = async dataToUpdate => {
    if (dataToUpdate.hasOwnProperty('username')) {
      const uniqueUsername = await setUniqueUsername(dataToUpdate.username);
      if (uniqueUsername !== dataToUpdate.username) {
        return {
          msg: `Username ${dataToUpdate.username} is already taken.
                You for can for example use ${uniqueUsername} instead`,
        };
      }
    }
    return true;
  };

  useEffect(() => {
    if (
      (state.photoURL.length && state.photoURL !== user.photoURL) ||
      (state.username.length >= minUsernameLength &&
        state.username !== user.username) ||
      (state.email.length && state.email !== user.email) ||
      (state.displayName.length && state.displayName !== user.displayName)
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
          label={user.username ? user.username : 'Anonymous username'}
          value={state.username}
          onChangeText={name => actions.setUsername(name.toLowerCase().trim())}
        />
        <TextField
          baseColor={theme.colors.lightAccent}
          tintColor={theme.colors.lightAccent}
          label={user.displayName ? user.displayName : 'Anonymous Name'}
          value={state.displayName}
          onChangeText={name => actions.setDisplayName(name.trim())}
        />
        <TextField
          baseColor={theme.colors.lightAccent}
          tintColor={theme.colors.lightAccent}
          label={user.email ? user.email : 'Anonymous Email'}
          value={state.email}
          onChangeText={email => actions.setEmail(email.trim())}
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
