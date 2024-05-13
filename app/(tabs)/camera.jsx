import { Image,Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { launchCameraAsync, MediaTypeOptions } from 'expo-image-picker';



export default function Camera() {

  const [prediction,setPrediction] = useState('');

  // To handle upload button
  const pickImage = async () => {
    console.log("Capture Button Pressed");

    // Get image
    const result = await launchCameraAsync(
      {
        mediaTypes : MediaTypeOptions.Images,
        base64 : true,
        selectionLimit : 1,
      }
    )

    if (result.cancelled) {
      console.log("User Cancelled Image Capture");
      return;
    }
    else{
    console.log("Captured Image : ",result);
    }

    console.log("Going to fetch")
    // Post the image to api
    const response = await fetch("https://florascannerapi.onrender.com/predict",{
      method : "POST",
      headers : {
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({image:result.assets[0].base64})
    })

    const temp = await response.json()
    console.log("API response : ",temp);
    setPrediction(temp);

  }
  return (
    <SafeAreaView>
      <Text>
        Hello Upload new the ehllo do something
      </Text>

      <TouchableOpacity
      onPress={pickImage}
      >
       <Text>Capture Image</Text>
      </TouchableOpacity>

      <Text>{prediction.class}</Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
