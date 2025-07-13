import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Inbox = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Inbox</Text>
    </View>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
});
