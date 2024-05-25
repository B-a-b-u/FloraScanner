import { Stack } from 'expo-router'

const RootLayout = () => {
  return (
    <Stack screenOptions={{
      headerShown: false,
    }} >
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='(auth)' />
    </Stack>
  )
}

export default RootLayout