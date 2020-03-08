import React, { useState, useEffect } from "react";
import ImagePicker from "react-native-image-picker";
import { Avatar } from "react-native-elements";

const ImageUploader = ({ user }) => {
  const [photoUri, setPhotoUri] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const options = {
    title: "Change avatar",
    mediaType: "photo",
    storageOptions: {
      skipBackup: true,
      path: "images"
    }
  };

  const upload = () => {
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);
      if (response.error) {
        console.error("ImagePicker Error: ", response.error);
      } else {
        const source = { uri: "data:image/jpeg;base64," + response.data };
        setPhotoUri(source);
        setPhotoUrl(response.uri);
        setPhotoChanged(true);
      }
    });
  };

  return (
    <Avatar
      size="large"
      rounded
      title={user.displayName && user.displayName[0]}
      source={
        photoUrl
          ? { uri: photoUrl }
          : user.photoURL
          ? { uri: user.photoURL }
          : null
      }
      showEditButton
      onEditPress={() => upload()}
    />
  );
};

export default ImageUploader;
