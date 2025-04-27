import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import InputField from "../../UI/InputField";
import Button from "../../UI/Button";
import Persona from "../../../../assets/persona.png";
import { updateUserProfile } from "../../Firebase/Auth";

export const EditProfileScreen = ({ navigation, route }) => {
  const {
    initialFullName,
    initialBio,
    initialWebsite,
    initialImage,
    initialAge,
    initialSport,
  } = route.params || {};

  const [bio, setBio] = useState(initialBio || "Bio");
  const [website, setWebsite] = useState(initialWebsite || "www.yoursite.com");
  const [image, setImage] = useState(initialImage || Persona);
  const [fullName, setFullName] = useState(initialFullName || "userName");
  const [sport, setSport] = useState(initialAge || "Sport");
  const [age, setAge] = useState(initialSport || "Age");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(fullName, bio, website, image, sport, age);
      Alert.alert("Success", "Profile updated successfully!");
      navigation.navigate("UserProfileScreen", {
        initialFullName: fullName,
        updatedBio: bio,
        updatedWebsite: website,
        updatedImage: image,
        updateAge: age,
        updateSport: sport,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: image }} style={styles.profileImage} />
        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
      </TouchableOpacity>

      <InputField
        placeholder="Edit UserName"
        value={fullName}
        onChangeText={setFullName}
      />

      <InputField placeholder="Edit Bio" value={bio} onChangeText={setBio} />

      <InputField
        placeholder="Edit Website"
        value={website}
        onChangeText={setWebsite}
      />

      <InputField
        placeholder="Enter Sport (e.g. Football)"
        value={sport}
        onChangeText={setSport}
      />

      <InputField
        placeholder="Enter Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <View style={styles.buttonWrapper}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          style={styles.buttonstyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a40003",
    padding: 20,
    alignItems: "center",
    paddingTop: 90,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: "#000",
    alignSelf: "center",
  },
  changePhotoText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  buttonWrapper: {
    width: 200,
    marginTop: 1,
    transform: [{ scale: 0.9 }],
  },
});

export default EditProfileScreen;
