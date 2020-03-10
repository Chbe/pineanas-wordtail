import firebase from '@react-native-firebase/app';
import { getUid } from '../auth/FBAuthService';

export const uploadPhoto = async photo => {
  const uid = getUid();
  const storageRef = firebase.storage().ref();
  const userPhotoRef = storageRef.child(`${uid}/avatar`);

  try {
    await userPhotoRef.putString(photo, 'base64', {
      contentType: 'image/jpeg',
    });
    const downloadUrl = await userPhotoRef.getDownloadURL();
    return downloadUrl;
  } catch (error) {
    console.error(error);
  }
};
