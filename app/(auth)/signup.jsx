import { View,TextInput, Text, Pressable,StyleSheet,SafeAreaView, KeyboardAvoidingView , ActivityIndicator} from 'react-native'
import React, { useState } from 'react'
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { Redirect } from 'expo-router';


const firebaseConfig = {
  apiKey: "AIzaSyB4cn83vwE7UJlyr-eH5l4hnk56YiySj0s",
  authDomain: "florascanner-4f4ff.firebaseapp.com",
  projectId: "florascanner-4f4ff",
  storageBucket: "florascanner-4f4ff.appspot.com",
  messagingSenderId: "57419221422",
  appId: "1:57419221422:web:b827a7ffa828aeddf2203f",
  measurementId: "G-X52047XLNC"
};



const SignUp =  () => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [isLoading,setIsLoading] = useState(false);
    const [isCreated, setIsCreated] = useState(false);

    const handleSubmit = async () => {
      setIsLoading(true)
        console.log("Submit Button Pressed");
        const app = initializeApp(firebaseConfig);

        console.log("Firebase App : ",app);

        const auth = await getAuth(app);
        console.log("Firebase Auth : ",auth);

        const response = await createUserWithEmailAndPassword(auth,email,password);
        console.log("Response : ",response)
        if(response){
          try{
            const db = await getFirestore(app);
            console.log("Database initalized : ",db);
            const userHistory = await collection(db,"UserHistory");
            console.log("collection initalized : ",userHistory);
            const document = await doc(userHistory,email)
            console.log("Document Initalized : ",document)
            const resp = await setDoc(document,{"plants" : []})
            console.log("Data is setted : ",resp)
          }
          catch(error){
            console.log("Firestore error : ",error);
          }
          setIsCreated(true);
        }

       

        setEmail('');
        setPassword('');
        setIsLoading(false);
    }
    return (
      <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
        {isLoading ? <ActivityIndicator size="large" /> : 
        (
          <View style={styles.inputContainer}>
          <Text style={styles.title}>Create Your Flora Scanner Account</Text>
          <TextInput
            value={email}
            style={styles.input}
            placeholder='Email'
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            value={password}
            style={styles.input}
            placeholder='Password'
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
    backgroundColor: '#41B06E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default SignUp
