import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { Link, Redirect } from 'expo-router'

const Dummy = () => {
  return (
    <Redirect href='/home' />
  )
}

export default Dummy