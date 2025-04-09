import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { auth, db } from "../../../../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const AvailabilityCalendar = ({ profileUserId }) => {
  const navigation = useNavigation();
  const [availability, setAvailability] = useState({});
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);
  const isOwner = auth.currentUser?.uid === profileUserId;

  useFocusEffect(
    useCallback(() => {
      const fetchAvailability = async () => {
        const snapshot = await getDocs(collection(db, "availabilities"));
        const data = {};
        snapshot.forEach((docSnap) => {
          const dataVal = docSnap.data();
          if (dataVal.userId === profileUserId) {
            data[dataVal.date] = { ...dataVal, id: docSnap.id };
          }
        });
        setAvailability(data);
      };

      fetchAvailability();
    }, [profileUserId])
  );

  const markedDates = Object.entries(availability).reduce(
    (acc, [date, value]) => {
      acc[date] = {
        selected: true,
        selectedColor:
          value.status === "allDay"
            ? "#4CAF50"
            : value.status === "none"
            ? "#E53935"
            : "#FF9800",
      };
      return acc;
    },
    {}
  );

  const handleDayPress = (day) => {
    const details = availability[day.dateString];
    if (details) {
      setSelectedDayDetails({ date: day.dateString, ...details });
    } else if (isOwner) {
      navigation.navigate("EditAvailabilityCalendar", {
        date: day.dateString,
        userId: profileUserId,
        status: "",
        time: "",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(
        doc(db, "availabilities", `${profileUserId}_${selectedDayDetails.date}`)
      );
      const updated = { ...availability };
      delete updated[selectedDayDetails.date];
      setAvailability(updated);
      setSelectedDayDetails(null);
    } catch (err) {
      console.error("Error deleting availability:", err);
    }
  };

  return (
    <View>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          calendarBackground: "#000",
          dayTextColor: "#fff",
          monthTextColor: "#fff",
          arrowColor: "#fff",
        }}
      />

      <Modal visible={!!selectedDayDetails} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Availability Details</Text>
            <Text>Date: {selectedDayDetails?.date}</Text>
            <Text>
              Status:{" "}
              {selectedDayDetails?.status === "allDay"
                ? "Available All Day"
                : selectedDayDetails?.status === "none"
                ? "Not Available"
                : `Partially Available (${selectedDayDetails?.time})`}
            </Text>

            {isOwner && (
              <View style={{ marginTop: 10 }}>
                <Text
                  style={styles.editText}
                  onPress={() => {
                    navigation.navigate("EditAvailabilityCalendar", {
                      id: selectedDayDetails.id,
                      date: selectedDayDetails.date,
                      status: selectedDayDetails.status,
                      time: selectedDayDetails.time,
                      userId: profileUserId,
                    });
                    setSelectedDayDetails(null);
                  }}
                >
                  Edit
                </Text>
                <Text style={styles.deleteText} onPress={handleDelete}>
                  Delete
                </Text>
              </View>
            )}

            <Text
              style={styles.modalClose}
              onPress={() => setSelectedDayDetails(null)}
            >
              Close
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalClose: {
    color: "blue",
    marginTop: 15,
    textAlign: "right",
  },
  editText: {
    color: "#1e88e5",
    marginTop: 10,
    fontWeight: "bold",
  },
  deleteText: {
    color: "#d32f2f",
    marginTop: 5,
    fontWeight: "bold",
  },
});

export default AvailabilityCalendar;
