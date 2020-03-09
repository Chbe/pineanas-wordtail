import firebase from "@react-native-firebase/app";

export const updateAuthProfile = async userData => {
  try {
    await firebase.auth().currentUser.updateProfile(userData);
  } catch (error) {
    console.error(error);
  }
};
