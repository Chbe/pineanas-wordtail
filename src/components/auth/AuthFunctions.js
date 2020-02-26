// import { LoginManager, AccessToken } from "react-native-fbsdk";
import firebase from "@react-native-firebase/app";

export const logout = () => {
  try {
    firebase.auth().signOut();
  } catch (error) {
    console.error(error);
  }
};

// Calling the following function will open the FB login dialogue:
// export const facebookLogin = async () => {
//   try {
//     const result = await LoginManager.logInWithPermissions([
//       "public_profile",
//       "email"
//     ]);

//     if (result.isCancelled) {
//       // handle this however suites the flow of your app
//       console.warn("User cancelled request");
//       return null;
//     }

//     // get the access token
//     const data = await AccessToken.getCurrentAccessToken();

//     if (!data) {
//       // handle this however suites the flow of your app
//       console.error("Something went wrong obtaining the users access token");
//       return null;
//     }

//     // create a new firebase credential with the token
//     const credential = firebase.auth.FacebookAuthProvider.credential(
//       data.accessToken
//     );

//     // login with credential
//     const firebaseUserCredential = await firebase
//       .auth()
//       .signInWithCredential(credential);
//     prepareDataForUpdate(firebaseUserCredential.user);

//     return firebaseUserCredential;
//   } catch (e) {
//     console.error(e);
//   }
// };

export const anonymousLogin = async () => {
  try {
    const firebaseUserCredential = await firebase.auth().signInAnonymously();
    prepareDataForUpdate(firebaseUserCredential.user, false, true);
  } catch (error) {}
  console.error(error);
};

export const emailLogin = async (email, password) => {
  try {
    const firebaseUserCredential = firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    prepareDataForUpdate(firebaseUserCredential.user, true);
    return firebaseUserCredential;
  } catch (error) {
    console.error(error);
  }
};

const checkIfUserExists = async uid => {
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

const generateFromNameOrEmail = async (
  nameOrEmail,
  generateFromEmail = false,
  anonymous = false
) => {
  let username = "";
  if (generateFromEmail) {
    username = generateUsernameFromEmail(nameOrEmail);
  } else if (!anonymous) {
    username = generateUsernameFromDisplayname(nameOrEmail);
  } else {
    username = nameOrEmail;
  }

  const takenUsername = await controlUsername(username);
  if (takenUsername) {
    /** Get number end of string */
    const matches = takenUsername.match(/\d+$/);
    if (matches) {
      username += +matches[0] + 1;
    } else {
      username += 1;
    }
  }
  return username;
};

const generateUsernameFromEmail = email => {
  return email.match(/^([^@]*)@/)[1].toLowerCase();
};

const generateUsernameFromDisplayname = displayName => {
  const displayNameArray = displayName.split(" ");
  let username = "";
  if (displayNameArray.length === 1) {
    /** E.g. john */
    username = `${displayNameArray[0]}`.toLowerCase();
  } else if (displayNameArray.length === 2) {
    /** E.g. johndoe */
    username = `${displayNameArray[0]}${displayNameArray[1]}`.toLowerCase();
  } else if (displayNameArray.length > 2) {
    /** E.g. johnsdoe */
    username = `${displayNameArray[0]}${displayNameArray[1].substring(0, 1)}${
      displayNameArray[2]
    }`.toLowerCase();
  } else {
  }
  return username;
};

const controlUsername = async username => {
  try {
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

const prepareDataForUpdate = async (
  userData,
  generateFromEmail = false,
  anonymous = false
) => {
  const userExist = await checkIfUserExists(userData.uid);
  if (!userExist) {
    if (!anonymous) {
      const { displayName, email, photoURL, uid } = userData;
      const username = await generateFromNameOrEmail(
        displayName,
        generateFromEmail
      );
      updateUserData({ displayName, email, photoURL, uid, username });
    } else {
      const username = await generateFromNameOrEmail("anonymous", false, true);
      const anonymousData = {
        displayName: "Anony Mous",
        email: "",
        photoURL: "",
        uid: userData.uid,
        username
      };
      updateUserData(anonymousData);
    }
  }
};

const updateUserData = ({ displayName, email, photoURL, uid, username }) => {
  try {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .set(
        {
          uid,
          displayName,
          username,
          email,
          photoURL
        },
        {
          merge: true
        }
      );
  } catch (error) {
    console.error(error);
  }
};
