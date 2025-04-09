import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, Image } from "react-native";
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
import BottomNav from "../../Navigations/BottomNav";

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
              <Image
                source={{
                  uri: card.image || "https://via.placeholder.com/300",
                }}
                style={styles.cardImage}
              />
              <View style={styles.overlay}>
                <Text style={styles.TopLine}>
                  <Text style={styles.name}>{card.name}</Text>
                  <Text style={styles.age}> {card.age}</Text>
                </Text>

                <Text style={styles.subText}>{card.sport}</Text>
              </View>
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

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent",
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    height: "75%",
    backgroundColor: "#000",
    elevation: 5,
  },

  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },

  overlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderRadius: 10,
  },
  TopLine: {},
  age: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "light",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  subText: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 2,
  },
});

export default AthleteExploreScreen;
