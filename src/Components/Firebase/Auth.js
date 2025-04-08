import { auth, db } from "../../../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Alert } from "react-native";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

//-------------------LOGSCREENS----------------------------------------
export const loginUser = async (email, password, navigation) => {
  if (!email || !password) {
    Alert.alert("Please enter a valid email and password.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      console.log("User Data on Auth Change:", userData);

      navigation.navigate("UserProfileScreen", { fullName: userData.name });
    }
  } catch (error) {
    Alert.alert("Login Failed: " + error.message);
  }
};

export const registerUser = async (
  fullName,
  email,
  password,
  confirmPassword,
  navigation
) => {
  if (!fullName || !email || !password || !confirmPassword) {
    Alert.alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Passwords do not match.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), { name: fullName, email });
    Alert.alert("Success! Account created.");
    navigation.navigate("UserProfileScreen", { fullName });
  } catch (error) {
    Alert.alert("Registration Failed: " + error.message);
  }
};

export const resetPassword = async (email) => {
  if (!email) {
    Alert.alert("Please enter your email address first.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    Alert.alert("Password reset link sent to your email.");
  } catch (error) {
    Alert.alert("Error: " + error.message);
  }
};
//-----------------------PROFILES---------------------------------
export const updateUserProfile = async (fullName, bio, website, image) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const userRef = doc(db, "users", user.uid);

  try {
    await setDoc(
      userRef,
      {
        name: fullName,
        bio,
        website,
        image,
      },
      { merge: true }
    );
    console.log("User profile updated successfully!");
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    console.warn("No user profile found in Firestore");
    return null;
  }
};

//-----------------------Notifications---------------------------------
export const saveExpoPushTokenToUserProfile = async (token) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in");
      return;
    }

    await setDoc(
      doc(db, "users", user.uid),
      { fcmToken: token },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving token:", error);
    throw error;
  }
};
