import firebase from "@react-native-firebase/app";

export const uploadPhoto = photo => {
  const uid = firebase.auth().currentUser;
  const storageRef = firebase.storage().ref();
  const userPhotoRef = storageRef.child(`${uid}/photo`);

  try {
      await userPhotoRef.putString(photo, 'base64');
  } catch (error) {
      console.error(error);
  }
};
