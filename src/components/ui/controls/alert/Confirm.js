import { Alert } from 'react-native';

export const Confirm = async (
  title,
  message,
  btn1Txt = 'OK',
  btn2Txt = 'Cancel',
  cancelable = true
) =>
  new Promise(resolve => {
    Alert.alert(
      title,
      message,
      [
        {
          text: btn1Txt,
          onPress: () => resolve(true),
        },
        {
          text: btn2Txt,
          onPress: () => resolve(false),
          style: 'cancel',
        },
      ],
      { cancelable }
    );
  });
