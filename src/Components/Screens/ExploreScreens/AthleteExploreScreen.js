import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
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
      const user = auth.currentUser;
      if (!user) return;
      setCurrentUser(user);

      const swipedRef = collection(db, "friendRequests");
      const swipedQuery = query(swipedRef, where("fromUserId", "==", user.uid));
      const swipedSnap = await getDocs(swipedQuery);
      const swipedIds = swipedSnap.docs.map((doc) => doc.data().toUserId);

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("__name__", "!=", user.uid));
      const querySnapshot = await getDocs(q);

      const usersData = [];
      querySnapshot.forEach((doc) => {
        if (!swipedIds.includes(doc.id)) {
          usersData.push({ id: doc.id, ...doc.data() });
        }
      });

      setUsers(usersData);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSwipeRight = async (cardIndex) => {
    const swipedUser = users[cardIndex];

    try {
      const friendRequestRef = doc(
        db,
        "friendRequests",
        `${currentUser.uid}_${swipedUser.id}`
      );

      await setDoc(friendRequestRef, {
        fromUserId: currentUser.uid,
        toUserId: swipedUser.id,
        status: "pending",
        createdAt: new Date(),
      });

      await setDoc(doc(collection(db, "notifications")), {
        recipient: swipedUser.id,
        senderId: currentUser.uid,
        type: "friend_request",
        read: false,
        createdAt: new Date(),
        relatedId: friendRequestRef.id,
      });

      if (swipedUser.fcmToken) {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: swipedUser.fcmToken,
            sound: "default",
            title: "New Friend Request",
            body: `${
              currentUser.displayName || "Someone"
            } sent you a friend request!`,
            data: {
              type: "friend_request",
              senderId: currentUser.uid,
              relatedId: friendRequestRef.id,
            },
          }),
        });
      }

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
