import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Animated,
  TouchableOpacity,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../../../../firebaseConfig";

const AthleteExploreScreen = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      setCurrentUser(currentUser);

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("__name__", "!=", currentUser.uid));
      const querySnapshot = await getDocs(q);

      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });

      setUsers(usersData);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSwipeRight = async (cardIndex) => {
    const swipedUser = users[cardIndex];

    try {
      await setDoc(doc(collection(db, "friendRequests")), {
        fromUser: doc(db, "users", currentUser.uid),
        toUser: doc(db, "users", swipedUser.id),
        status: "pending",
        createdAt: new Date(),
      });

      await setDoc(doc(collection(db, "notifications")), {
        recipient: doc(db, "users", swipedUser.id),
        sender: doc(db, "users", currentUser.uid),
        type: "friend_request",
        read: false,
        createdAt: new Date(),
        relatedId: doc(
          db,
          "friendRequests",
          `${currentUser.uid}_${swipedUser.id}`
        ).id,
      });

      Alert.alert("Friend request sent!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSwipeLeft = (cardIndex) => {
    console.log("Skipped user:", users[cardIndex].name);
  };

  return (
    <View style={styles.container}>
      {users.length > 0 ? (
        <Swiper
          cards={users}
          renderCard={(card) => (
            <View style={styles.card}>
              <Text style={styles.text}>{card.name}</Text>
            </View>
          )}
          onSwipedRight={handleSwipeRight}
          onSwipedLeft={handleSwipeLeft}
          backgroundColor={"transparent"}
          stackSize={3}
        />
      ) : (
        <Text>No users to display</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  card: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white",
    height: "70%",
    padding: 20,
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent",
  },
});

export default AthleteExploreScreen;
