import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../../../firebaseConfig";
import Button from "../../UI/Button";

const EditClubScreen = ({ route, navigation }) => {
  const club = route.params?.club;
  const [name, setName] = useState(club?.name || "");
  const [description, setDescription] = useState(club?.description || "");
  const [image, setImage] = useState(club?.image || "");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const saveClub = async () => {
    try {
      const user = auth.currentUser;

      const clubData = {
        name,
        description,
        image: image || "",
        updatedAt: serverTimestamp(),
      };

      if (club) {
        await updateDoc(doc(db, "clubs", club.id), clubData);
      } else {
        const newRef = doc(collection(db, "clubs"));
        await setDoc(newRef, {
          ...clubData,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
        });
      }

      Alert.alert("Success", "Club info saved");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Club Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="e.g., name of the club"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <Text style={styles.label}>Club Image</Text>
      {image ? (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      ) : null}

      <TouchableOpacity style={styles.smallButton} onPress={pickImage}>
        <Text style={styles.smallButtonText}>Pick an Image</Text>
      </TouchableOpacity>

      <Button title={club ? "Update Club" : "Add Club"} onPress={saveClub} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: "bold", marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  smallButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
    marginTop: 10,
  },
  smallButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditClubScreen;
