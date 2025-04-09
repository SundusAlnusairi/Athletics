import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { auth } from "../../../../firebaseConfig";
const ClubDetailScreen = ({ route, navigation }) => {
  const { club } = route.params;
  const user = auth.currentUser;

  const handleDelete = () => {
    Alert.alert("Delete Club", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "clubs", club.id));
          navigation.goBack(); // Go back to the list
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: club.image || "https://via.placeholder.com/200" }}
        style={styles.image}
      />
      <Text style={styles.title}>{club.name}</Text>
      <Text style={styles.description}>{club.description}</Text>

      {user?.uid === club.createdBy && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("EditClubScreen", { club: club })
            }
          >
            <Ionicons name="create-outline" size={24} color="#fff" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#a40003" }]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={24} color="#fff" />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 15,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, color: "#444" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
});

export default ClubDetailScreen;
