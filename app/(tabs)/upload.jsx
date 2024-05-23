import { View, Text, StyleSheet, Pressable, Modal, ScrollView,Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';
import { getDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import * as ImageManipulator from 'expo-image-manipulator';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';



const firebaseConfig = {
  apiKey: "AIzaSyB4cn83vwE7UJlyr-eH5l4hnk56YiySj0s",
  authDomain: "florascanner-4f4ff.firebaseapp.com",
  projectId: "florascanner-4f4ff",
  storageBucket: "florascanner-4f4ff.appspot.com",
  messagingSenderId: "57419221422",
  appId: "1:57419221422:web:b827a7ffa828aeddf2203f",
  measurementId: "G-X52047XLNC"
};

const app = initializeApp(firebaseConfig)
const OPENCAGE_API_KEY = 'da971b063b1e47b686e3c42df43b8c4b';

export default function Upload() {

  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const resizeImage = async (uri) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 224, height: 224 } }], // Resize the image to 224x224
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    return manipResult.base64;
  };

  const getCityName = async (latitude, longitude) => {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].components.city || data.results[0].components.town || data.results[0].components.village || data.results[0].components.hamlet || 'Unknown location';
    }
    return 'Unknown location';
  };


  // To handle upload button
  const pickImage = async () => {
    console.log("Upload Button Pressed");

    // Get image
    const result = await launchImageLibraryAsync(
      {
        mediaTypes: MediaTypeOptions.Images,
        base64: true,
        quality : 0.5,
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

    const resizedImageBase64 = await resizeImage(result.assets[0].uri);
    let cityName = "Not Found";

    let { status } = await requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    }
    else{
      let location = await getCurrentPositionAsync({});
      console.log("User Location: ", location);
  
      cityName = await getCityName(location.coords.latitude, location.coords.longitude);
      console.log("City Name: ", cityName);
    }

    // Get current date and time
    const currentDateTime = new Date().toISOString();
    console.log("Current DateTime: ", currentDateTime);

    // Post the image to api
    setIsLoading(true);
    const response = await fetch("https://florascannerapi.onrender.com/predict", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: resizedImageBase64 })
    })

    

    const temp = await response.json()
    console.log("API response : ", temp);
    setPrediction(temp);
    setIsLoading(false);
    setIsModalVisible(true);

    if (user) {
      try {
        console.log("Plant name: ", temp.class);
        console.log("User email: ", user.email);
        console.log("City name : ",cityName);
        console.log("Firebase app: ", app);
        const db = getFirestore(app);
        console.log("Firebase db: ", db);
        const userDocRef = doc(db, 'UserHistory', user.email); 
        console.log("doc: ", userDocRef);

        const docSnapshot = await getDoc(userDocRef);
        const existingPlants = docSnapshot.exists() ? docSnapshot.data().plants || [] : [];

        const updatedPlants = [...existingPlants, {
          location: cityName,
          dateTime: currentDateTime,
          plantName: temp.class
        }];

        await setDoc(userDocRef, { plants: updatedPlants});

      } catch (error) {
        console.error('Error updating document:', error);
      }
    } else {
      console.log('User is not authenticated. Unable to update document.');
    }

  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
          <Image style={styles.image} source={require("../../assets/images/upload_screen_image.png")} />
        </View>
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

      {isLoading ? <ActivityIndicator size='large' /> :
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
  heading: {
    fontFamily: "InknutAntiqua-Black",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#71CF4C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 20,
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
