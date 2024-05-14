import { View, Text, StyleSheet, ActivityIndicator, Pressable, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { launchCameraAsync, MediaTypeOptions } from 'expo-image-picker';



export default function Camera() {

  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    setIsLoading(false);
    setIsModalVisible(true);

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

      {isLoading ? <ActivityIndicator /> :
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
    marginBottom: 20,
    fontWeight : "bold",

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
