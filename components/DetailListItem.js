// src/buoi2/components/DetailListItem.js
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import colors from "../utils/colors";

const DetailListItem = ({ icon, title, subtitle, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {icon && (
        <Icon
          name={icon}
          size={24}
          style={{
            color: colors.black,
            marginRight: 20,
          }}
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <Icon name="chevron-right" size={26} style={{ color: colors.greyDark }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomColor: colors.greyLight,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    color: colors.greyDark,
    fontSize: 15,
    marginTop: 4,
  },
});

export default DetailListItem;
