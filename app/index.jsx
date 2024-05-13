import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { Link } from 'expo-router'

const Dummy = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>Welcome to FloraScanner!</Text>
        <Link href='/upload'>Click to Explore</Link>
      </View>
    </SafeAreaView>
  )
}

export default Dummy