import { Redirect } from 'expo-router'
import { useEffect } from 'react'
import *  as SplashScreen from "expo-splash-screen"
const Index = () => {

  // Show Splash Screen  for 1 second
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    const simulateLoading = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust timing as needed
      await SplashScreen.hideAsync();
    };

    simulateLoading();
  }, []);

  return (
    <Redirect href='/home' />
  )
}

export default Index