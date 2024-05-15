import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Profille = () => {
  return (
    <View>
      <Text>Profille</Text>
      <Link href='/signin'>SignIn</Link>
    </View>
  )
}

export default Profille