import React from "react";
import { View, TextInput, Image, StyleSheet } from "react-native";

const InputField = ({
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Image source={icon} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#ccc"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 20,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#fff",
  },
});

export default InputField;
