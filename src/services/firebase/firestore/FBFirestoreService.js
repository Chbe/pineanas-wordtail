import { getUid, updateAuthProfile } from '../auth/FBAuthService';

import firebase from '@react-native-firebase/app';
import { minUsernameLength } from '../../../const/Const';
import { uploadPhoto } from '../storage/FBStorageService';

export const getUserRef = () => firebase.firestore().doc(`users/${getUid()}`);

export const getUsersRef = (limit = 3) =>
  firebase
    .firestore()
    .collection('users')
    .limit(limit);

export const getUserGamesRef = (limit = 5) =>
  firebase
    .firestore()
    .collection('games')
    .where('playersUid', 'array-contains', getUid())
    .orderBy('status', 'asc')
    .orderBy('lastUpdated', 'desc');
// .limit(limit); TODO

export const updateUserInfo = async (profileData = {}) => {
  const userdata = { ...profileData };
  if (profileData.hasOwnProperty('photoURL')) {
    userdata.photoURL = await uploadPhoto(profileData.photoURL);
  }

  await Promise.all[
    (updateAuthProfile(userdata),
    saveDocument(`users/${getUid()}`, userdata, false, true))
  ];
};

export const saveDocument = async (
  path,
  data,
  update = false,
  merge = true
) => {
  const segments = path.split('/').filter(v => v);
  if (segments.length % 2) {
    /** Odd is always a collection */
    try {
      await firebase
        .firestore()
        .collection(path)
        .add(data);
    } catch (error) {
      console.error(error);
    }
  } else {
    const docRef = firebase.firestore().doc(path);
    try {
      update ? await docRef.update(data) : docRef.set(data, { merge });
    } catch (error) {
      console.error(error);
    }
  }
};

export const controlUsername = async username => {
  /** Check if another username starts with param */
  try {
    const snapshot = await firebase
      .firestore()
      .collection('users')
      .where('username', '>=', username)
      .orderBy('username', 'DESC')
      .limit(1)
      .get();

    if (snapshot.docs.length > 0) {
      return snapshot.docs[0].data().username;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const setUniqueUsername = async username => {
  const takenUsername = await controlUsername(username);
  if (takenUsername) {
    /** Get number end of string */
    const matches = takenUsername.match(/\d+$/);
    if (matches) {
      username += +matches[0] + 1;
    } else {
      username += 1;
    }
  }
  if (username.length < minUsernameLength) {
    const diff = 5 - username.length;
    for (let i = 0; i < diff; i++) {
      username += i;
    }
  }
  return username;
};

export const checkIfUserExists = async uid => {
  try {
    const user = await firebase
      .firestore()
      .doc(`users/${uid}`)
      .get();
    return user.exists ? true : false;
  } catch (error) {
    console.error(`Error in checkIfUserExist(): ${error}`);
  }
};
