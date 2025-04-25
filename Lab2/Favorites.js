// src/buoi2/Favorites.js
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { fetchContacts } from "../utils/api";
import ContactThumbnail from "../components/ContactThumbnail";
import colors from "../utils/colors";

const keyExtractor = ({ phone }) => phone;

const Favorites = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchContacts()
      .then((contacts) => {
        setContacts(contacts);
        setLoading(false);
        setError(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(true);
      });
  }, []);

  const renderFavoriteThumbnail = ({ item }) => {
    const { avatar, name, phone } = item;
    return (
      <ContactThumbnail
        avatar={avatar}
        name={name}
        phone={phone}
        onPress={() => navigation.navigate("Profile", { contact: item })}
      />
    );
  };

  const favorites = contacts.filter((contact) => contact.favorite);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color={colors.blue} />}
      {error && <Text>Error loading favorites...</Text>}
      {!loading && !error && (
        <FlatList
          data={favorites}
          keyExtractor={keyExtractor}
          numColumns={3}
          contentContainerStyle={styles.list}
          renderItem={renderFavoriteThumbnail}
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
  list: {
    alignItems: "center",
  },
});

export default Favorites;
