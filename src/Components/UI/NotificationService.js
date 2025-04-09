import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Permission for notifications not granted");
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "61804995-600a-4bf1-8a4c-8b23648b6cb7",
    });
    const token = tokenData.data;

    console.log("Expo Push Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting push notification token:", error);
    return null;
  }
};

export const handleNotificationReceived = (callback) => {
  const foregroundSub = Notifications.addNotificationReceivedListener(
    (notification) => {
      if (callback) {
        callback(notification.request.content.data);
      }
    }
  );

  const responseSub = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      if (callback) {
        callback(response.notification.request.content.data);
      }
    }
  );

  return () => {
    foregroundSub.remove();
    responseSub.remove();
  };
};

export const handleNotificationNavigation = async (data, navigationRef) => {
  if (!data || !navigationRef?.isReady()) return;

  switch (data.type) {
    case "friend_request":
      navigationRef.navigate("FriendRequestScreen");
      break;
    case "message":
      const senderRef = doc(db, "users", data.senderId);
      const senderSnap = await getDoc(senderRef);
      const senderData = senderSnap.exists() ? senderSnap.data() : null;

      navigationRef.navigate("ChatScreen", {
        chatId: data.chatId,
        otherUser: {
          id: data.senderId,
          ...senderData,
        },
      });
      break;
    default:
      break;
  }
};
