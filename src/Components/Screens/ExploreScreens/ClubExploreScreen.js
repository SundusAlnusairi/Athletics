import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import BottomNav from "../../Navigations/BottomNav";
import { deleteDoc, doc } from "firebase/firestore";
import { Alert } from "react-native";
import { without } from "lodash";
const ClubExploreScreen = ({ navigation }) => {
  const [clubs, setClubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      fetchClubs();
    }, [])
  );

  const fetchClubs = async () => {
    const snapshot = await getDocs(collection(db, "clubs"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setClubs(data);
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search clubs..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredClubs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ClubDetailScreen", { club: item })
            }
          >
            <View style={styles.card}>
              <Image
                source={{
                  uri: item.image || "https://via.placeholder.com/200",
                }}
                style={styles.image}
              />
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No clubs yet</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("EditClubScreen")}
      >
        <Ionicons name="add" size={30} color={"white"} />
      </TouchableOpacity>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 15,
  },
  searchBar: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 60,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    height: 200,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
  },
  description: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    color: "#444",
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#a40003",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});

export default ClubExploreScreen;
