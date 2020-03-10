import firebase from "@react-native-firebase/app";
import {
  setDoc,
  controlUsername,
  checkIfUserExists
} from "../firestore/FBFirestoreService";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import { minUsernameLength } from "../../../const/Const";

export const getUid = () => firebase.auth().currentUser.uid;

export const getCurrentUser = () => firebase.auth().currentUser;

export const logout = () => {
  try {
    firebase.auth().signOut();
  } catch (error) {
    console.error(error);
  }
};

const handleErros = (error = "") => {
  if (error.hasOwnProperty("code")) {
    if (error.namespace === "auth") {
      return handleAuthError(error.message);
    } else {
      alert(error.namespace);
    }
  }
};

const handleAuthError = error => {
  const errorObj = { error: true, msg: "" };
  errorObj.msg = error.replace(/ *\[[^\]]*]/, "");
  return errorObj;
};

export const updateAuthProfile = async userData => {
  try {
    await firebase.auth().currentUser.updateProfile(userData);
  } catch (error) {
    console.error(error);
  }
};

// Calling the following function will open the FB login dialogue:
export const facebookLogin = async (convertUser = false) => {
  try {
    if (!convertUser) {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email"
      ]);

      if (result.isCancelled) {
        // handle this however suites the flow of your app
        console.warn("User cancelled request");
        return null;
      }
    }

    // get the access token
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      // handle this however suites the flow of your app
      console.error("Something went wrong obtaining the users access token");
      return null;
    }

    // create a new firebase credential with the token
    const credential = firebase.auth.FacebookAuthProvider.credential(
      data.accessToken
    );

    // login with credential
    const firebaseUserCredential = convertUser
      ? await firebase.auth().currentUser.linkWithCredential(credential)
      : await firebase.auth().signInWithCredential(credential);

    if (convertUser) {
      const { displayName, photoURL, email } = getProviderDataByName(
        firebaseUserCredential.user.providerData,
        "facebook.com"
      );

      await updateAuthProfile({ displayName, photoURL, email });
    }
    const userData = convertUser
      ? firebase.auth().currentUser
      : firebaseUserCredential.user;

    await prepareDataForUpdate(userData, false, false, convertUser);

    return firebaseUserCredential;
  } catch (e) {
    console.error(e);
  }
};

export const anonymousLogin = async () => {
  try {
    const firebaseUserCredential = await firebase.auth().signInAnonymously();
    prepareDataForUpdate(firebaseUserCredential.user, false, true);
  } catch (error) {
    console.error(error);
  }
};

export const emailLogin = async (email, password, register = false) => {
  try {
    const firebaseUserCredential = register
      ? await firebase.auth().createUserWithEmailAndPassword(email, password)
      : await firebase.auth().signInWithEmailAndPassword(email, password);

    register && prepareDataForUpdate(firebaseUserCredential.user, true);
    return firebaseUserCredential;
  } catch (error) {
    // console.error('catch', error);
    return handleErros(error);
  }
};

const getProviderDataByName = (data, providerName) =>
  data.find(p => p.providerId === providerName);

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
  if (username.length < minUsernameLength) {
    const diff = 5 - username.length;
    for (let i = 0; i < diff; i++) {
      username += i;
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

const prepareDataForUpdate = async (
  userData,
  generateFromEmail = false,
  anonymous = false,
  forceUpdate = false
) => {
  const userExist = await checkIfUserExists(userData.uid);
  if (!userExist || forceUpdate) {
    if (!anonymous) {
      const { displayName, email, photoURL, uid } = userData;
      const username = await generateFromNameOrEmail(
        generateFromEmail ? email : displayName,
        generateFromEmail
      );
      setDoc("users", getUid(), {
        displayName,
        email,
        photoURL,
        uid,
        username
      });
    } else {
      const username = await generateFromNameOrEmail("anonymous", false, true);
      const anonymousData = {
        displayName: "Anony Mous",
        email: "",
        photoURL: "",
        uid: userData.uid,
        username
      };
      setDoc("users", getUid(), anonymousData);
    }
  }
};
