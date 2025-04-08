import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export const NavLink = ({ message, linkText, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <Pressable onPress={onPress}>
        <Text style={styles.link}>{linkText}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 17,
    color: "#fff",
  },
  link: {
    fontSize: 17,
    color: "#ffcc00",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default NavLink;
