import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Button } from 'react-native-web';

const Card = ({ title, imageUrl }) => {
  return (
    <View style={styles.card}>
    <View>
    <Image source={imageUrl} style={styles.image} />
    </View>
      <View>
      <Pressable style={styles.title}><Text>{title}</Text></Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode : "contain",
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Card;
