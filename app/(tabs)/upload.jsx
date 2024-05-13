import { Image, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';


export default function Upload() {

  const [prediction, setPrediction] = useState('');
  const [isLoading,setIsLoading] = useState(false);

  // To handle upload button
  const pickImage = async () => {
    console.log("Upload Button Pressed");

    // Get image
    const result = await launchImageLibraryAsync(
      {
        mediaTypes: MediaTypeOptions.Images,
        base64: true,
        selectionLimit: 1,
      }
    )

    if (result.cancelled) {
      console.log("User Cancelled Image Upload");
      return;
    }
    else {
      console.log("Picked Image : ", result);
    }

    // Post the image to api
    setIsLoading(true);
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
    isLoading(false);

  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={
        {
          fontFamily: "InknutAntiqua-Black"
        }
      }>
        Click the Button to Upload the Plant Image
      </Text>

      <Pressable
        onPress={pickImage}
        style={styles.uploadButton}
      >
        <Text
          style={styles.uploadText}
        >Upload Image</Text>
      </Pressable>

      {isLoading ? <ActivityIndicator></ActivityIndicator> :
      <>
        <Text>{prediction.class}</Text>
      </>}
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