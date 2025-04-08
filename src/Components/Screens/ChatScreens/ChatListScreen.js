import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../../../firebaseConfig";
import BottomNav from "../../Navigations/BottomNav";

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
        where("participants", "array-contains", currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const chatsData = [];

      for (const docRef of querySnapshot.docs) {
        const chat = docRef.data();
        const otherUserId = chat.participants.find(
          (uid) => uid !== currentUser.uid
        );

        if (otherUserId) {
          const otherUserSnap = await getDoc(doc(db, "users", otherUserId));
          const otherUserData = otherUserSnap.data();

          chatsData.push({
            id: docRef.id,
            otherUser: {
              id: otherUserId,
              ...otherUserData,
            },
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
            <View style={styles.chatRow}>
              <Image
                source={{ uri: item.otherUser.image }}
                style={styles.profileImage}
              />

              <View style={styles.chatTextContainer}>
                <Text style={styles.chatName}>{item.otherUser.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No chats yet</Text>}
      />
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#666",
    top: 35,
  },
  chatName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  lastMessage: {
    top: 3,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "#333",
  },
});

export default ChatListScreen;
