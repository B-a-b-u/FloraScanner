import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name='signup'>
      </Stack.Screen>
    </Stack>
  )
}

export default AuthLayout