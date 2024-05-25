import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 10
        },
        tabBarActiveTintColor: '#3B9213',
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
                tintColor={color}
                style={
                  {
                    width: 30,
                    height: 30,
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
          title: "Upload",
          tabBarIcon: ({ color, focused }) => (
            <>

              <Image
                source={require("../../assets/icons/upload_icon.png")}
                tintColor={color}
                style={
                  {
                    width: 50,
                    height: 50,
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
                tintColor={color}
                style={
                  {
                    width: 30,
                    height: 30,
                  }
                }

                resizeMode='contain'
              />
            </>
          ),
        }}
      />


      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <>

              <Image
                source={require("../../assets/icons/profile.png")}
                tintColor={color}
                style={
                  {
                    width: 30,
                    height: 30,
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
