import { View, Text, SafeAreaView, Image, StyleSheet } from 'react-native'
import React from 'react'

const HomeLayout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/Focus-amico.png")}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text style={styles.title}>Welcome to Flora Scanner App</Text>
      <Text style={styles.subtitle}>Explore about the Plants in just a click</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 250,
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
    marginBottom: 20,
  },
  featuresContainer: {
    marginTop: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featureItem: {
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
  },
});

export default HomeLayout
