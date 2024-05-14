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
        tabBarLabelStyle : {
          fontFamily : 'InknutAntiqua-Bold',
          fontSize : 10
        },
        tabBarActiveTintColor : '#3B9213',
        headerShown: false,
      }}>

<Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <>
            
            <Image
            source={require("../../assets/icons/home.png")}
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
