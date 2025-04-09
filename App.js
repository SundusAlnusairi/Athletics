import { StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import {
  registerForPushNotifications,
  handleNotificationReceived,
} from "./src/Components/UI/NotificationService";
import { createNavigationContainerRef } from "@react-navigation/native";
import { saveExpoPushTokenToUserProfile } from "./src/Components/Firebase/Auth";

import RegisterUserScreen from "./src/Components/Screens/RegisterationScreens/RegisterUserScreen";
import LogUserInScreen from "./src/Components/Screens/RegisterationScreens/LogUserInScreen";
import UserProfileScreen from "./src/Components/Screens/ProfileScreens/UserProfileScreen";
import ClubExploreScreen from "./src/Components/Screens/ExploreScreens/ClubExploreScreen";
import AthleteExploreScreen from "./src/Components/Screens/ExploreScreens/AthleteExploreScreen";
import ChatListScreen from "./src/Components/Screens/ChatScreens/ChatListScreen";
import UserPostScreen from "./src/Components/Screens/PostContentScreen/UserPostScreen";
import EditProfileScreen from "./src/Components/Screens/ProfileScreens/EditProfileScreen";
import ChatScreen from "./src/Components/Screens/ChatScreens/ChatScreen";
import NotificationsScreen from "./src/Components/Screens/ExploreScreens/NotificationsScreen";
import FriendRequestScreen from "./src/Components/Screens/ExploreScreens/FriendRequestScreen";
import WelcomeScreen from "./src/Components/Screens/RegisterationScreens/WelcomeScreen";
import EditClubScreen from "./src/Components/Screens/ExploreScreens/EditClubScreen";
import ClubDetailScreen from "./src/Components/Screens/ExploreScreens/ClubDetailScreen";

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

export const App = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const token = await registerForPushNotifications();

        if (token) {
          await saveExpoPushTokenToUserProfile(token);
          console.log("FCM token registered and saved");
        }

        const unsubscribe = handleNotificationReceived((data) => {
          console.log("Notification received:", data);

          if (navigationRef.isReady()) {
            if (data.type === "friend_request") {
              navigationRef.navigate("FriendRequestScreen");
            } else if (data.type === "message") {
              navigationRef.navigate("ChatScreen", {
                chatId: data.chatId,
                otherUser: { id: data.senderId },
              });
            }
          }
        });

        return () => {
          unsubscribe?.();
        };
      } catch (error) {
        console.error("Notification setup error:", error);
      }
    };

    setupNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="WelcomeScreen"
          screenOptions={{
            headerStyle: { backgroundColor: "black" },
            headerTintColor: "white",
          }}
        >
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LogUserInScreen"
            component={LogUserInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterUserScreen"
            component={RegisterUserScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserProfileScreen"
            component={UserProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ClubExploreScreen"
            component={ClubExploreScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditClubScreen"
            component={EditClubScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="ClubDetailScreen"
            component={ClubDetailScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="AthleteExploreScreen"
            component={AthleteExploreScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="UserPostScreen"
            component={UserPostScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="ChatListScreen"
            component={ChatListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FriendRequestScreen"
            component={FriendRequestScreen}
            options={{ headerShown: true, title: "Friend Requests" }}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={({ route }) => ({
              headerShown: true,
              title: route.params.otherUser.name,
            })}
          />
          <Stack.Screen
            name="NotificationsScreen"
            component={NotificationsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
