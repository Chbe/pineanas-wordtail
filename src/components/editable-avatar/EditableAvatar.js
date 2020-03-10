import React, { useState } from 'react';

import { Avatar } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

const EditableAvatar = ({ user, actions }) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  const options = {
    title: 'Change avatar',
    mediaType: 'photo',
    quality: 0,
    customButtons: [{ name: 'clear', title: 'Keep current avatar' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const upload = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        actions.setPhotoUrl('');
        setPhotoUrl('');
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
