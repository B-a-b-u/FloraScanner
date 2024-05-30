import { View, Text, StyleSheet, ActivityIndicator, Pressable, Modal, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { launchCameraAsync, MediaTypeOptions } from 'expo-image-picker';
import { getDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import * as ImageManipulator from 'expo-image-manipulator';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import CustomActivityIndicator from '../(cards)/activityIndicator';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MSG_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENTID
};
const app = initializeApp(firebaseConfig)

export default function Camera() {

  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  // Look for any Authentication State changes
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Resize the Image
  const resizeImage = async (uri) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 224, height: 224 } }], // Resize the image to 224x224
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      return manipResult.base64;
    }
    catch (error) {
      console.log("Image Resize Error : ", error)
      return uri;
    }

  }

  // Getting Location Details from OpenCage API

  const getCityName = async (latitude, longitude) => {
    try {
      const OPENCAGE_API_KEY = await process.env.EXPO_PUBLIC_OPENCAGE_API_KEY;
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].components.city || data.results[0].components.town || data.results[0].components.village || data.results[0].components.hamlet || 'Unknown location';
      }

    }
    catch (error) {
      console.error("Getting City Name API error : ", error);
      return 'Unknown location';

    }
  }


  // To handle upload button
  const captureImage = async () => {
    console.log("Capture Button Pressed");

    // Get image
    try {
      const result = await launchCameraAsync(
        {
          mediaTypes: MediaTypeOptions.Images,
          base64: true,
          quality: 0.5,
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

      const resizedImageBase64 = await resizeImage(result.assets[0].uri);


      console.log("Going to fetch")
      setIsLoading(true);

      // Post the image to api
      const api = process.env.EXPO_PUBLIC_FS_API;
      const response = await fetch(api, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: resizedImageBase64 })
      })

      const temp = await response.json()
      console.log("API response : ", temp);
      let cityName = "Not Found";

      if (user) {
        try {

          let { status } = await requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Permission to access location was denied');
          }
          else {
            try {
              let location = await getCurrentPositionAsync({});
              console.log("User Location: ", location);

              cityName = await getCityName(location.coords.latitude, location.coords.longitude);
              console.log("City Name in get city call: ", cityName);
            }
            catch (error) {
              console.error("Current Location error : ", error);
            }

          }


        }
        catch (error) {
          console.error("Location Data error : ", error);
          cityName = "Not Found";
        }


      }

      const delay = async (ms) => {
        return new Promise((resolve) => 
            setTimeout(resolve, ms));
    };
      setPrediction(temp);
      await delay(2000);
      setIsLoading(false);
      setIsModalVisible(true);

      if (user) {
        try {

          if (!cityName) {
            cityName = "Not Found";
          }
          console.log("Plant name: ", temp.class);
          console.log("User email: ", user.email);
          console.log("City name : ", cityName);
          console.log("Firebase app: ", app);
          const db = getFirestore(app);
          console.log("Firebase db: ", db);
          const userDocRef = doc(db, 'UserHistory', user.email);
          console.log("doc: ", userDocRef);

          const docSnapshot = await getDoc(userDocRef);
          const existingPlants = docSnapshot.exists() ? docSnapshot.data().plants || [] : [];

          // Get current date and time
          const currentDateTime = new Date().toISOString();
          console.log("Current DateTime: ", currentDateTime);

          const updatedPlants = [...existingPlants, {
            location: cityName,
            dateTime: currentDateTime,
            plantName: temp.class
          }];

          await setDoc(userDocRef, { plants: updatedPlants });

        } catch (error) {
          console.error('Error updating document:', error);
        }
      } else {
        console.log('User is not authenticated. Unable to update document.');
      }
    }
    catch (error) {
      console.log("Error on Capturing Image : ", error);
    }

  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require("../../assets/images/capture_screen_image.png")} />
      </View>
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

      {isLoading ?  <CustomActivityIndicator show={isLoading} resizeMethod='contain' style = {styles.image}  /> :
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}
        >
          <ScrollView>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Prediction Result</Text>
                <Text style={styles.resultText}>Plant Name: {prediction?.class}</Text>
                <Text style={styles.resultText}>Confidence: {prediction?.confidence}%</Text>
                <Text style={styles.modalText}>Details</Text>
                {prediction?.details && (
                  <View>
                    <Text style={styles.detailTitle}>Scientific Name:</Text>
                    <Text style={styles.detailText}>{prediction.details.scientificName}</Text>
                    <Text style={styles.detailTitle}>Medicinal Property:</Text>
                    <Text style={styles.detailText}>{prediction.details.medicinalProperty}</Text>
                    <Text style={styles.detailTitle}>Medicinal Details:</Text>
                    {prediction.details.medicinalDetails && prediction.details.medicinalDetails.map((detail, index) => (
                      <Text key={index} style={styles.detailText}>{detail}</Text>
                    ))}
                    <Text style={styles.detailTitle}>Common Growth Location:</Text>
                    <Text style={styles.detailText}>{prediction.details.commonGrowthLocation}</Text>
                    <Text style={styles.detailTitle}>Disclaimer:</Text>
                    <Text style={styles.detailText}>{prediction.details.disclaimer}</Text>
                  </View>
                )}
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    setIsModalVisible(false);
                  }}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </Modal>



      }


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

  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",

  },
  uploadButton: {
    backgroundColor: '#71CF4C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  prediction: {
    fontSize: 18,
    marginTop: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff', // Changed background color
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20, // Increased font size
    fontWeight: 'bold',
    color: '#333', // Changed text color
  },
  resultText: {
    marginBottom: 10,
    fontSize: 16,
    color: '#555', // Changed text color
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailTitle: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  detailText: {
    flex: 1,
    color: '#777', // Changed text color
  },
  button: {
    marginTop: 15,
    backgroundColor: '#41B06E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonTextColor: {
    color: '#fff',
    fontWeight: 'bold',
  },

  detailTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  detailText: {
    marginBottom: 15,
    fontSize: 14,
    color: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
