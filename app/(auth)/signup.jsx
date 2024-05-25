import { View, TextInput, Image, Text, Pressable, StyleSheet, Modal, SafeAreaView, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { Redirect } from 'expo-router';


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


const SignUp = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);


  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      console.log("Submit Button Pressed");
      const auth = await getAuth(app);
      console.log("Firebase Auth : ", auth);
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Response : ", response)
      if (response) {
        try {
          const db = await getFirestore(app);
          console.log("Database initalized : ", db);
          const userHistory = await collection(db, "UserHistory");
          console.log("collection initalized : ", userHistory);
          const document = await doc(userHistory, email)
          console.log("Document Initalized : ", document)
          const resp = await setDoc(document, { "plants": [] })
          console.log("Data is setted : ", resp)
        }
        catch (error) {
          console.log("Firestore error : ", error);
          setModalMessage(error.message);
          setShowModal(true);
        }
        setIsCreated(true);
      }
    }
    catch (error) {
      console.log("Sign Up Error : ", error);
      setModalMessage(error.message)
      setShowModal(true);
    }
    finally {

      setEmail('');
      setPassword('');
      setIsLoading(false);
    }



  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require("../../assets/images/signup_image.png")} />
        </View>
        {isLoading ? <ActivityIndicator size="large" /> :
          (
            <View style={styles.inputContainer}>
              <Text style={styles.title}>Create Your Flora Scanner Account</Text>
              <TextInput
                value={email}
                style={styles.input}
                placeholder='Email'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoCapitalize='none'

                onChangeText={(text) => setEmail(text)}
              />
              <TextInput
                value={password}
                style={styles.input}
                placeholder='Password'
                autoCapitalize='none'
                textContentType='password'
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
              />
              <Pressable onPress={handleSubmit} style={styles.submitButton} disabled={isLoading}>
                <Text style={styles.submitText}>Submit</Text>
              </Pressable>

              {isCreated ? <Redirect href="/profile" /> : <></>}
            </View>

          )
        }
      </KeyboardAvoidingView>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)} 
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <Pressable style={styles.closeButton} onPress={() => setShowModal(false)}> 
          <Text style={styles.closeButtonText} >Close</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#71CF4C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#D20103',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});


export default SignUp;
