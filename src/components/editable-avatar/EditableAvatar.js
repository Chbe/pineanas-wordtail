import React, { useState } from "react";
import ImagePicker from "react-native-image-picker";
import { Avatar } from "react-native-elements";

const EditableAvatar = ({ user, actions }) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  const options = {
    title: "Change avatar",
    mediaType: "photo",
    quality: 0,
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
      } else if (response.data) {
        setPhotoUrl(response.uri);
        actions.setPhotoUrl(response.data);
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

export default EditableAvatar;
