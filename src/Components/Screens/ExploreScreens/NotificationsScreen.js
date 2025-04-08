import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../../../../firebaseConfig";
import BottomNav from "../../Navigations/BottomNav";

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const q = query(
        collection(db, "notifications"),
        where("recipient", "==", currentUser.uid),
        where("read", "==", false)
      );

      const querySnapshot = await getDocs(q);
      const notificationsData = [];

      for (const docRef of querySnapshot.docs) {
        const notification = docRef.data();

        let senderData = {};
        if (notification.senderId) {
          const senderSnap = await getDoc(
            doc(db, "users", notification.senderId)
          );
          senderData = senderSnap.exists() ? senderSnap.data() : {};
          senderData.id = notification.senderId;
        }

        notificationsData.push({
          id: docRef.id,
          ...notification,
          sender: senderData,
        });
      }

      setNotifications(notificationsData);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleNotificationPress = async (notification) => {
    try {
      await updateDoc(doc(db, "notifications", notification.id), {
        read: true,
      });

      switch (notification.type) {
        case "friend_request":
          Alert.alert(
            "Friend Request",
            `${
              notification.sender?.name || "Someone"
            } sent you a friend request.`,
            [
              {
                text: "Accept",
                onPress: async () => {
                  try {
                    const currentUser = auth.currentUser;

                    await setDoc(doc(collection(db, "friends")), {
                      user1: currentUser.uid,
                      user2: notification.senderId,
                      createdAt: new Date(),
                    });

                    const chatRef = doc(collection(db, "chats"));
                    await setDoc(chatRef, {
                      participants: [currentUser.uid, notification.senderId],
                      createdAt: new Date(),
                      lastMessage: "",
                    });

                    Alert.alert("Friend request accepted!");
                    fetchNotifications();
                  } catch (error) {
                    Alert.alert("Error", error.message);
                  }
                },
              },
              {
                text: "Decline",
                style: "cancel",
                onPress: async () => {
                  fetchNotifications();
                },
              },
            ]
          );
          break;

        case "friend_request_accepted":
        case "message":
          navigation.navigate("ChatScreen", {
            chatId: notification.relatedId,
            otherUser: notification.sender,
          });
          break;

        default:
          break;
      }

      fetchNotifications();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.notificationItem}
            onPress={() => handleNotificationPress(item)}
          >
            <Text style={styles.notificationTitle}>
              {item.sender?.name || "Someone"}
            </Text>
            <Text style={styles.notificationText}>
              {item.type === "friend_request"
                ? "Sent you a friend request"
                : item.type === "friend_request_accepted"
                ? "Accepted your friend request"
                : "Sent you a message"}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No new notifications</Text>
        }
      />
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    top: 40,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationText: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 90,
  },
});

export default NotificationsScreen;
