import { Image, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { launchCameraAsync, MediaTypeOptions } from 'expo-image-picker';



export default function Camera() {

  const [prediction, setPrediction] = useState('');

  // To handle upload button
  const captureImage = async () => {
    console.log("Capture Button Pressed");

    // Get image
    const result = await launchCameraAsync(
      {
        mediaTypes: MediaTypeOptions.Images,
        base64: true,
        selectionLimit: 1,
      }
    )

    if (result.cancelled) {
      console.log("User Cancelled Image Capture");
      return;
    }
    else {
      console.log("Captured Image : ", result);
    }

    console.log("Going to fetch")
    // Post the image to api
    const response = await fetch("https://florascannerapi.onrender.com/predict", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: result.assets[0].base64 })
    })

    const temp = await response.json()
    console.log("API response : ", temp);
    setPrediction(temp);

  }
  return (
    <SafeAreaView style={styles.container}>
      <Text>
        Click the Button to Capture the Plant Image
      </Text>

      <Pressable
        onPress={captureImage}
        style={styles.uploadButton}
      >
        <Text
          style={styles.uploadText}
        >Capture Image</Text>
      </Pressable>

      <Text>{prediction.class}</Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontFamily: "InknutAntiqua-Black",
    fontSize: 24,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#71CF4C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "InknutAntiqua-Regular"
  },
  prediction: {
    fontSize: 18,
    marginTop: 20,
  },
});