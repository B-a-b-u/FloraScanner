import { View, Text, SafeAreaView, Image, StyleSheet } from 'react-native'
import React from 'react'

const HomeLayout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/splash.png")}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text>Welcome to Flora Scanner App</Text>
      <Text>Explore about the Plants in just a click</Text>
    </SafeAreaView>
  )
}


export default HomeLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
