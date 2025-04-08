import React, { useState } from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import Button from "../../UI/Button";
import InputField from "../../UI/InputField";
import { loginUser, resetPassword } from "../../Firebase/Auth";
import NavLink from "../../Navigations/NavLink";
import Iconemail from "../../../../assets/email.png";
import Iconlockpasswordline from "../../../../assets/locked-computer.png";

const LogUserInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          icon={Iconemail}
        />
        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          icon={Iconlockpasswordline}
          secureTextEntry
        />

        <Button
          title="Log In"
          onPress={() => loginUser(email, password, navigation)}
          style={styles.loginButton}
        />
        <NavLink
          message=""
          linkText="Forgot Password?"
          onPress={() => resetPassword(email)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#a40003",
    padding: 20,
    justifyContent: "center",
  },
  loginButton: {
    marginTop: 80,
  },
};

export default LogUserInScreen;
