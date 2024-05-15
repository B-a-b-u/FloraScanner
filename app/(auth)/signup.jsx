import { View,TextInput, Text, Pressable,StyleSheet,SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};




const SignUp =  () => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [isLoading,setIsLoading] = useState(false);

    const handleSubmit = async () => {
      setIsLoading(true)
        console.log("Submit Button Pressed");
        const app = initializeApp(firebaseConfig);

        console.log("Firebase App : ",app);

        const auth = await getAuth(app);
        console.log("Firebase Auth : ",auth);

        const response = await createUserWithEmailAndPassword(auth,email,password);
        console.log("Response : ",response)

       

        setEmail('');
        setPassword('');
        setIsLoading(false);
    }
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
            <TextInput 
            value={email}
            style={styles.input}
            placeholder='plant@gmail.com'
            onChangeText={(text) => {
                setEmail(text)
            }}
            />

          <TextInput 
          value={password}
          style={styles.input}
            onChangeText={(text) => {
                setPassword(text)
            }}
            secureTextEntry
            />
          <Pressable
          onPress={handleSubmit}
          >
            <Text>Submit</Text>
          </Pressable>
        </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
  },
  inputContainer: {
      width: '80%',
  },
  input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
  },
  button: {
      backgroundColor: '#007bff',
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
  },
  buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
});


export default SignUp
