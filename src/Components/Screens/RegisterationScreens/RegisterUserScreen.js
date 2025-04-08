import React, { useState } from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import InputField from "../../UI/InputField";
import Button from "../../UI/Button";
import NavLink from "../../Navigations/NavLink";
import { registerUser } from "../../Firebase/Auth";
import Iconemail from "../../../../assets/email.png";
import Iconlockpasswordline from "../../../../assets/locked-computer.png";
import Iconuser from "../../../../assets/icon _user_.png";

const RegisterUserScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <InputField
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          icon={Iconuser}
        />
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
        <InputField
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          icon={Iconlockpasswordline}
          secureTextEntry
        />

        <Button
          title="Sign Up"
          onPress={() =>
            registerUser(fullName, email, password, confirmPassword, navigation)
          }
        />
        <NavLink
          message="Already have an account?"
          linkText="Log In"
          onPress={() => navigation.navigate("LogUserInScreen")}
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
};

export default RegisterUserScreen;
