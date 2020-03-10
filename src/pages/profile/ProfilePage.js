import { Avatar, Button, Text, withTheme } from 'react-native-elements';
import {
  PaddingView,
  SafeWrapper,
} from '../../components/ui/containers/Containers';
import React, { useEffect, useState } from 'react';
import {
  getCurrentUser,
  logout,
} from '../../services/firebase/auth/FBAuthService';

import Anonymous from './anonymous/Anonymous';
import { Confirm } from '../../components/ui/controls/alert/Confirm';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import NotAnonymous from './not-anonymous/NotAnonymous';
import { getUserRef } from '../../services/firebase/firestore/FBFirestoreService';

const ProfilePage = ({ navigation, theme }) => {
  const [user, setUser] = useState({});
  const [fbUser, setFbUser] = useState({});

  navigation.setOptions({
    headerRight: () => (
      <PaddingView>
        <FontAwesome5Icon
          color={theme.barStyle === 'light-content' ? '#fff' : '#000'}
          size={24}
          name="sign-out-alt"
          onPress={async () => {
            const doSignOut = await Confirm(
              'Sign out',
              'Are you sure you want to sign out?'
            );
            doSignOut && logout();
          }}
        />
      </PaddingView>
    ),
  });

  const setUserInfo = async querySnapshot => {
    setFbUser(getCurrentUser());
    const userData = querySnapshot.data();
    if (userData) {
      setUser(userData);
    }
  };

  useEffect(() => {
    let unsubscribe = getUserRef().onSnapshot(setUserInfo);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeWrapper bg={theme.colors.lightShade}>
      <PaddingView>
        {fbUser && !fbUser.isAnonymous ? (
          <NotAnonymous user={user} />
        ) : (
          <Anonymous user={user} />
        )}
      </PaddingView>
    </SafeWrapper>
  );
};

export default withTheme(ProfilePage);
