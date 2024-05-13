import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarBackground : () => (
          <>
          </>
        ),
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="upload"
        options={{
          title : "Upload",
          tabBarIcon: ({ color, focused }) => (
            <>
            
            <Image
            source={require("../../assets/icons/upload_icon.png")}
            name={focused ? 'home' : 'home-outline'} 
            tintColor={color} 
            style={
              {
                width : 50,
                height : 50,
              }
            }

            resizeMode='contain'
            />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Capture',
          tabBarIcon: ({ color, focused }) => (
            <>
            
            <Image
            source={require("../../assets/icons/capture_image.png")}
            name={focused ? 'home' : 'home-outline'} 
            tintColor={color} 
            style={
              {
                width : 30,
                height : 30,
              }
            }

            resizeMode='contain'
            />
            </>
          ),
        }}
      />
    </Tabs>
  );
}
