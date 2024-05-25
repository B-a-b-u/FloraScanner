import { Stack } from "expo-router"

const CardsLayout = () => {
    return (
        <Stack screenOptions={{
          headerShown: false,
        }}>
          <Stack.Screen name='cards_page'>
          </Stack.Screen>
        </Stack>
      )
}

export default CardsLayout