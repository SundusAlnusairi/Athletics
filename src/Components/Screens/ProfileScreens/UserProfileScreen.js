import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { auth } from "../../../../firebaseConfig";
import { getUserProfile } from "../../Firebase/Auth";
import Button from "../../UI/Button";
import Persona from "../../../../assets/persona.png";
import GalleryIcon from "../../../../assets/grid-2.png";
import CalendarIcon from "../../../../assets/calendar.png";
import CommentsIcon from "../../../../assets/user.png";
import ProfileSections from "./ProfileSections";
import BottomNav from "../../Navigations/BottomNav";

const UserProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("UserName");
  const [selectedTab, setSelectedTab] = useState("posts");
  const [bio, setBio] = useState("Bio");
  const [website, setWebsite] = useState("www.yoursite.com");
  const [image, setImage] = useState(Persona);
  const [userId, setUserId] = useState(null);
  const [sport, setSport] = useState("Sport");
  const [age, setAge] = useState("Age");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile();
        if (userData) {
          setFullName(userData.name || "username");
          setBio(userData.bio || "Bio");
          setWebsite(userData.website || "www.yoursite.com");
          setImage({ uri: userData.image || Persona });
          setUserId(auth.currentUser?.uid);
          setSport(userData.sport || "Sport");
          setAge(userData.age || "Age");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.yournamehere}>{fullName}</Text>

      <View style={styles.profileContainer}>
        <Image source={image} style={styles.personaIcon} />

        <View style={styles.bioContainer}>
          <Text style={styles.bio}>{bio}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(website)}>
            <Text style={styles.website}>{website}</Text>
          </TouchableOpacity>

          <View style={styles.buttonWrapper}>
            <Button
              title="Edit Profile"
              onPress={() =>
                navigation.navigate("EditProfileScreen", {
                  initialBio: bio,
                  initialFullName: fullName,
                  initialWebsite: website,
                  initialImage: image.uri || Persona,
                  initialSport: sport,
                  initialAge: age,
                })
              }
            />
          </View>
        </View>
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => setSelectedTab("posts")}
          style={styles.iconWrapper}
        >
          <Image source={GalleryIcon} style={styles.icon} />
          {selectedTab === "posts" && <View style={styles.activeLine} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedTab("calendar")}
          style={styles.iconWrapper}
        >
          <Image source={CalendarIcon} style={styles.icon} />
          {selectedTab === "calendar" && <View style={styles.activeLine} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedTab("tags")}
          style={styles.iconWrapper}
        >
          <Image source={CommentsIcon} style={styles.icon} />
          {selectedTab === "tags" && <View style={styles.activeLine} />}
        </TouchableOpacity>
      </View>

      <ProfileSections selectedTab={selectedTab} profileUserId={userId} />
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
    padding: 15,
  },
  yournamehere: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    color: "#fff",
  },
  profileContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#a40003",
    padding: 20,
    borderRadius: 15,
    height: 250,
  },
  personaIcon: {
    width: 90,
    height: 90,
    borderRadius: 60,
    top: -5,
  },
  bioContainer: {
    alignItems: "center",
    marginTop: -1,
  },
  bio: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
    marginBottom: 5,
  },
  website: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 5,
    marginTop: 10,
    textAlign: "center",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#fff",
    marginTop: 15,
  },
  icon: {
    width: 30,
    height: 30,
  },
  activeLine: {
    width: 50,
    height: 2,
    backgroundColor: "#fff",
    marginTop: 5,
    marginLeft: -10,
  },
  buttonWrapper: {
    width: 200,
    marginTop: -80,
    transform: [{ scale: 0.7 }],
  },
});

export default UserProfileScreen;
