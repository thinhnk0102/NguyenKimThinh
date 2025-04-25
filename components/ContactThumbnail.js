// src/buoi2/components/ContactThumbnail.js
import React from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import colors from "../utils/colors";

const ContactThumbnail = ({ avatar, name, phone, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      {name !== "" && <Text style={styles.name}>{name}</Text>}

      {phone !== "" && (
        <View style={styles.phoneSection}>
          <Icon name="phone" size={16} style={{ color: colors.greyDark }} />
          <Text style={styles.phone}>{phone}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderColor: colors.white,
    borderWidth: 2,
  },
  name: {
    fontSize: 20,
    marginTop: 24,
    marginBottom: 2,
    fontWeight: "bold",
    color: colors.white,
  },
  phoneSection: {
    flexDirection: "row",
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  phone: {
    marginLeft: 4,
    fontSize: 16,
    color: colors.white,
  },
});

export default ContactThumbnail;
