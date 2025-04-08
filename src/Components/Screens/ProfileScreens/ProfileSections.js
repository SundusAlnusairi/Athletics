import React from "react";
import { Text, StyleSheet } from "react-native";

const ProfileSections = ({ selectedTab }) => {
  switch (selectedTab) {
    case "posts":
      return <Text style={styles.contentText}>📸 Posts Section</Text>;
    case "calendar":
      return <Text style={styles.contentText}>📅 Calendar Section</Text>;
    case "tags":
      return <Text style={styles.contentText}>🏷️ Tagged Section</Text>;
    default:
      return <Text style={styles.contentText}>📸 Posts Section</Text>;
  }
};

const styles = StyleSheet.create({
  contentText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProfileSections;
