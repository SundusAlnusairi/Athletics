import React from "react";
import { View, Text, Image } from "react-native";
import Button from "../../UI/Button";
import Football from "../../../../assets/football.png";

export const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={Football} style={styles.footballImage} />

      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.description}>
          Find your perfect training partner. Get better, together.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate("RegisterUserScreen")}
        />
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#a40003",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: -10,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
  },
  description: {
    fontSize: 20,
    fontWeight: "300",
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    width: 300,
  },
  footballImage: {
    position: "absolute",
    width: 430,
    height: 600,
    top: -18,
    left: -10,
    resizeMode: "contain",
  },
  buttonContainer: {
    marginBottom: -460,
    width: "90%",
  },
};
