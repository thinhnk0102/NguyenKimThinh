// src/buoi2/Contacts.js
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import ContactListItem from "../components/ContactListItem";
import { fetchContacts } from "../utils/api";
import colors from "../utils/colors";

const Contacts = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchContacts()
      .then((contacts) => {
        setContacts(contacts);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        setError(true);
      });
  }, []);

  const keyExtractor = ({ phone }) => phone;

  const renderContact = ({ item }) => {
    const { name, avatar, phone } = item;
    return (
      <ContactListItem
        name={name}
        avatar={avatar}
        phone={phone}
        onPress={() => navigation.navigate("Profile", { contact: item })}
      />
    );
  };

  // Sort contacts alphabetically
  const contactsSorted = [...contacts].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color={colors.blue} />}
      {error && <Text>Error loading contacts...</Text>}
      {!loading && !error && (
        <FlatList
          data={contactsSorted}
          keyExtractor={keyExtractor}
          renderItem={renderContact}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    flex: 1,
  },
});

export default Contacts;
