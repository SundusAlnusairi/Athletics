import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AvailabilityCalendar from "./AvailabilityCalendar";

const ProfileSections = ({ selectedTab, profileUserId }) => {
  switch (selectedTab) {
    case "posts":
      return <Text style={styles.contentText}> Posts Section</Text>;
    case "calendar":
      return (
        <View style={{ marginTop: 10 }}>
          <AvailabilityCalendar profileUserId={profileUserId} />
        </View>
      );
    case "tags":
      return <Text style={styles.contentText}>Tagged Section</Text>;
    default:
      return <Text style={styles.contentText}>Posts Section</Text>;
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
