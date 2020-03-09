import { uploadPhoto } from "../storage/FBStorageService";
import { updateAuthProfile } from "../auth/FBAuthService";
import firebase from "@react-native-firebase/app";

const getUid = () => firebase.auth().currentUser.uid;

export const updateUserInfo = async (profileData = {}) => {
  const userdata = { ...profileData };
  if (profileData.hasOwnProperty("photoURL")) {
    userdata.photoURL = await uploadPhoto(profileData.photoURL);
  }

  await Promise.all[(updateAuthProfile(userdata), updateDbData(userdata))];
};

export const updateDbData = userdata => {
  try {
    firebase
      .firestore()
      .collection("users")
      .doc(getUid())
      .set(userdata, {
        merge: true
      });
  } catch (error) {
    console.error(error);
  }
};
