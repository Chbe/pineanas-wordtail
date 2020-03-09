import firebase from "@react-native-firebase/app";

export const uploadPhoto = async photo => {
  const uid = firebase.auth().currentUser.uid;
  const storageRef = firebase.storage().ref();
  const userPhotoRef = storageRef.child(`${uid}/avatar`);

  try {
    await userPhotoRef.putString(photo, "base64");
  } catch (error) {
    console.error(error);
  }
};
