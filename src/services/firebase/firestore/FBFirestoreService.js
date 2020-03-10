import { uploadPhoto } from "../storage/FBStorageService";
import { updateAuthProfile, getUid } from "../auth/FBAuthService";
import firebase from "@react-native-firebase/app";

export const getUserRef = () =>
  firebase
    .firestore()
    .collection("users")
    .doc(getUid());

export const getUsersRef = (limit = 3) =>
  firebase
    .firestore()
    .collection("users")
    .limit(limit);

export const getUserGamesRef = (limit = 5) =>
  firebase
    .firestore()
    .collection("games")
    .where("playersUid", "array-contains", getUid())
    .orderBy("status", "asc")
    .orderBy("lastUpdated", "desc");
// .limit(limit); TODO

export const updateUserInfo = async (profileData = {}) => {
  const userdata = { ...profileData };
  if (profileData.hasOwnProperty("photoURL")) {
    userdata.photoURL = await uploadPhoto(profileData.photoURL);
  }

  await Promise.all[
    (updateAuthProfile(userdata), setDoc("users", getUid(), userdata))
  ];
};

export const addDocumentToCol = async (col, data) => {
  try {
    await firebase
      .firestore()
      .collection(col)
      .add(data);
  } catch (error) {
    console.error(error);
  }
};

export const setDoc = async (col, doc, data, merge = true) => {
  try {
    await firebase
      .firestore()
      .collection(col)
      .doc(doc)
      .set(data, {
        merge
      });
  } catch (error) {
    console.error(error);
  }
};

export const controlUsername = async username => {
  try {
    // TODO: == ist för >=
    const snapshot = await firebase
      .firestore()
      .collection("users")
      .where("username", ">=", username)
      .orderBy("username", "DESC")
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
