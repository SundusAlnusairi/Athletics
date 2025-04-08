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
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../../../firebaseConfig";

const FriendRequestScreen = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const q = query(
        collection(db, "friendRequests"),
        where("toUser", "==", doc(db, "users", currentUser.uid)),
        where("status", "==", "pending")
      );

      const querySnapshot = await getDocs(q);
      const requestsData = [];

      for (const docRef of querySnapshot.docs) {
        const request = docRef.data();
        const fromUserSnap = await getDoc(request.fromUser);
        requestsData.push({
          id: docRef.id,
          fromUser: fromUserSnap.data(),
          ...request,
        });
      }

      setRequests(requestsData);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleAccept = async (requestId, fromUserId) => {
    try {
      const currentUser = auth.currentUser;

      await updateDoc(doc(db, "friendRequests", requestId), {
        status: "accepted",
      });

      await setDoc(doc(collection(db, "friends")), {
        user1: currentUser.uid,
        user2: fromUserId,
        createdAt: new Date(),
      });

      const chatRef = doc(collection(db, "chats"));
      await setDoc(chatRef, {
        participants: [currentUser.uid, fromUserId],
        lastMessage: "",
        lastMessageTime: new Date(),
      });

      await setDoc(doc(collection(db, "notifications")), {
        recipient: fromUserId,
        senderId: currentUser.uid,
        type: "friend_request_accepted",
        read: false,
        createdAt: new Date(),
        relatedId: chatRef.id,
      });

      const fromUserSnap = await getDoc(doc(db, "users", fromUserId));
      const senderFCM = fromUserSnap.data().fcmToken;

      if (senderFCM) {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: senderFCM,
            sound: "default",
            title: "Friend Request Accepted",
            body: `${
              currentUser.displayName || "Someone"
            } accepted your request!`,
            data: {
              type: "friend_request_accepted",
              chatId: chatRef.id,
              senderId: currentUser.uid,
            },
          }),
        });
      }

      fetchFriendRequests();
      Alert.alert("Friend request accepted!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await updateDoc(doc(db, "friendRequests", requestId), {
        status: "rejected",
      });

      fetchFriendRequests();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text>{item.fromUser.name}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={() => handleAccept(item.id, item.fromUser.id)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={() => handleReject(item.id)}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No friend requests</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: "green",
  },
  rejectButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default FriendRequestScreen;
