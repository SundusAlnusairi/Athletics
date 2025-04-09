import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { SelectList } from "react-native-dropdown-select-list";
import { useRoute } from "@react-navigation/native";

const EditAvailabilityCalendar = ({ navigation }) => {
  const route = useRoute();
  const { id, date, status, time = "" } = route.params || {};

  const [newStatus, setNewStatus] = useState(status || "none");
  const [fromTime, setFromTime] = useState(time.split(" - ")[0] || "");
  const [toTime, setToTime] = useState(time.split(" - ")[1] || "");
  const [showPicker, setShowPicker] = useState(null);

  const handleTimeChange = (event, selectedDate) => {
    if (!selectedDate) return;
    const formatted = selectedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (showPicker === "from") setFromTime(formatted);
    if (showPicker === "to") setToTime(formatted);
    setShowPicker(null);
  };

  const handleSave = async () => {
    try {
      const userId = route.params?.userId;
      const docId = id || `${userId}_${date}`;
      const docRef = doc(db, "availabilities", docId);
      await setDoc(docRef, {
        userId,
        date,
        status: newStatus,
        time: newStatus === "partial" ? `${fromTime} - ${toTime}` : "",
      });

      navigation.goBack();
    } catch (err) {
      console.error("Error updating availability:", err);
      Alert.alert("Error", "Something went wrong while saving.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Edit Availability for {date}</Text>

      <Text style={styles.text}>Status (allDay / none / partial):</Text>
      <SelectList
        setSelected={setNewStatus}
        data={[
          { key: "allDay", value: "allDay" },
          { key: "none", value: "none" },
          { key: "partial", value: "partial" },
        ]}
        defaultOption={
          status
            ? { key: status, value: status }
            : { key: "none", value: "none" }
        }
        save="value"
        boxStyles={styles.input}
        dropdownTextStyles={{ color: "#fff" }}
      />

      {newStatus === "partial" && (
        <>
          <Text style={styles.text}>From:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker("from")}
          >
            <Text>{fromTime || "Select Start Time"}</Text>
          </TouchableOpacity>

          <Text style={styles.text}>To:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker("to")}
          >
            <Text>{toTime || "Select End Time"}</Text>
          </TouchableOpacity>
        </>
      )}

      {showPicker && (
        <DateTimePicker
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          value={new Date()}
          onChange={handleTimeChange}
          textColor="#fff"
        />
      )}

      <TouchableOpacity onPress={handleSave}>
        <Text style={styles.saveButton}>Save Availability</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#000", flex: 1 },
  label: {
    fontSize: 18,
    marginBottom: 15,
    color: "#fff",
    fontWeight: "bold",
  },
  text: { color: "#fff", marginTop: 10, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  saveButton: {
    color: "#1e88e5",
    fontWeight: "bold",
    marginTop: 25,
    textAlign: "center",
    fontSize: 16,
  },
});

export default EditAvailabilityCalendar;
