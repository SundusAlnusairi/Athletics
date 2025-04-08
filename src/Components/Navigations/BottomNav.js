import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import HomeIcon from "../../../assets/home.png";
import AddIcon from "../../../assets/add.png";
import MessageIcon from "../../../assets/send-message_3682321.png";
import ProfileIcon from "../../../assets/user_3161848.png";
import SearchIcon from "../../../assets/search_10025455.png";
import NotificationIcon from "../../../assets/alarm-bell_6043679.png";

const BottomNav = () => {
  const navigation = useNavigation();

  const tabs = [
    { name: "ClubExploreScreen", icon: HomeIcon },
    { name: "AthleteExploreScreen", icon: SearchIcon },
    { name: "NotificationsScreen", icon: NotificationIcon },
    { name: "UserPostScreen", icon: AddIcon },
    { name: "ChatListScreen", icon: MessageIcon, needsParams: true },
    { name: "UserProfileScreen", icon: ProfileIcon },
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          onPress={() => {
            navigation.navigate(tab.name);
          }}
          style={styles.iconWrapper}
        >
          <Image source={tab.icon} style={styles.icon} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    left: 1,
    backgroundColor: "#121212",
    position: "absolute",
    bottom: 0,
    width: 400,
  },
  iconWrapper: {
    alignItems: "center",
  },
  icon: {
    top: -10,
    width: 30,
    height: 30,
    tintColor: "#fff",
  },
});
