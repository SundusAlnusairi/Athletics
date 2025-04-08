import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db, auth } from "../../../../firebaseConfig";

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const q = query(
        collection(db, "chats"),
        where(
          "participants",
          "array-contains",
          doc(db, "users", currentUser.uid)
        )
      );

      const querySnapshot = await getDocs(q);
      const chatsData = [];

      for (const docRef of querySnapshot.docs) {
        const chat = docRef.data();
        const otherUserId = chat.participants.find(
          (participant) => participant.id !== currentUser.uid
        );

        if (otherUserId) {
          const otherUserSnap = await getDoc(otherUserId);
          chatsData.push({
            id: docRef.id,
            otherUser: otherUserSnap.data(),
            lastMessage: chat.lastMessage,
            lastMessageTime: chat.lastMessageTime?.toDate(),
          });
        }
      }

      setChats(chatsData);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
              navigation.navigate("ChatScreen", {
                chatId: item.id,
                otherUser: item.otherUser,
              })
            }
          >
            <Text style={styles.chatName}>{item.otherUser.name}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No chats yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  chatName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lastMessage: {
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default ChatListScreen;
