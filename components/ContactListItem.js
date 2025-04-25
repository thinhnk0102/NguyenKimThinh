// src/buoi2/components/ContactListItem.js
import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Image } from 'react-native';
import colors from '../utils/colors';

const ContactListItem = ({ name, avatar, phone, onPress }) => {
  return (
    <TouchableHighlight 
      underlayColor={colors.greyLight}
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.contactInfo}>
        <Image 
          style={styles.avatar} 
          source={{ uri: avatar }} 
        />
        <View style={styles.details}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>{phone}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 24,
    marginTop: 0,
  },
  contactInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 24,
    borderBottomColor: colors.greyLight,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    borderRadius: 22,
    width: 44,
    height: 44,
  },
  details: {
    justifyContent: 'center',
    flex: 1,
    marginLeft: 20,
  },
  title: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    color: colors.greyDark,
    fontSize: 15,
    marginTop: 4,
  },
});

export default ContactListItem;