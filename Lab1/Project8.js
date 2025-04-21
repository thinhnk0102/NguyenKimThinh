import React from "react";
import {
  SectionList,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  name: {
    fontSize: 16,
  },
  separator: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: 1,
  },
  sectionHeader: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "rgb(170, 170, 170)",
  },
});

const PEOPLE = [
  { name: { title: "Ms", first: "Maeva", last: "Scott" } },
  { name: { title: "Ms", first: "Maëlle", last: "Henry" } },
  { name: { title: "Mr", first: "Mohamoud", last: "Faaij" } },
  { name: { title: "Mr", first: "John", last: "Anderson" } },
  { name: { title: "Ms", first: "Emily", last: "Zimmer" } },
  { name: { title: "Mr", first: "Chris", last: "Evans" } },
  { name: { title: "Mrs", first: "Anna", last: "Brown" } },
  { name: { title: "Mr", first: "David", last: "Clark" } },
  { name: { title: "Ms", first: "Lina", last: "Quinn" } },
  { name: { title: "Dr", first: "Brian", last: "Hughes" } },
  { name: { title: "Miss", first: "Sophia", last: "Green" } },
  { name: { title: "Ms", first: "Ivy", last: "Nguyen" } },
  { name: { title: "Mr", first: "Jack", last: "Wright" } },
  { name: { title: "Mr", first: "Leo", last: "Tran" } },
  { name: { title: "Ms", first: "Tina", last: "Vega" } },
  { name: { title: "Mrs", first: "Olivia", last: "King" } },
  { name: { title: "Dr", first: "Ethan", last: "Young" } },
  { name: { title: "Mr", first: "Aaron", last: "Fox" } },
  { name: { title: "Ms", first: "Grace", last: "Bell" } },
  { name: { title: "Mrs", first: "Nora", last: "Davis" } },
];

const groupPeopleByLastName = (_data) => {
  const data = [..._data];
  const groupedData = data.reduce((accumulator, item) => {
    const group = item.name.last[0].toUpperCase();
    if (accumulator[group]) {
      accumulator[group].data.push(item);
    } else {
      accumulator[group] = {
        title: group,
        data: [item],
      };
    }
    return accumulator;
  }, {});

  const sections = Object.keys(groupedData).map((key) => groupedData[key]);

  return sections.sort((a, b) => (a.title > b.title ? 1 : -1));
};

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SectionList
        sections={groupPeopleByLastName(PEOPLE)}
        keyExtractor={(item) => `${item.name.first}-${item.name.last}`}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>
              {item.name.first} {item.name.last}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}
