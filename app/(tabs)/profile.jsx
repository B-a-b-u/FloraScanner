import { View,TextInput, Text, Pressable,StyleSheet,SafeAreaView, KeyboardAvoidingView,ActivityIndicator, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { onAuthStateChanged, getAuth, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'expo-router';

const firebaseConfig = {
  apiKey: "AIzaSyB4cn83vwE7UJlyr-eH5l4hnk56YiySj0s",
  authDomain: "florascanner-4f4ff.firebaseapp.com",
  projectId: "florascanner-4f4ff",
  storageBucket: "florascanner-4f4ff.appspot.com",
  messagingSenderId: "57419221422",
  appId: "1:57419221422:web:b827a7ffa828aeddf2203f",
  measurementId: "G-X52047XLNC"
};



const Profile =  () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [noAcc, setNoAcc] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log('Response : ', response);
    }  catch (error) {
      if (error.code === 'auth/invalid-email' || error.code === 'auth/invalid-credential') {
        setShowModal(true);
        setNoAcc(true);
      }
      else{
      console.error('Error signing in:', error.message);
      }
    } finally {
      setEmail('');
      setPassword('');
      setIsLoading(false);
    }
  };

  const handleLogOut = async () => {
    setIsLoading(true)
    const auth = getAuth();
    await signOut(auth);
    setIsLoading(false)
  };

  const closeModal = () => {
    setShowModal(false);
    setNoAcc(false); // Reset noAcc state
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
        {isLoading ? <ActivityIndicator size="large"/> : 
        (
          <View style={styles.profileContainer}>
            {user ? (
              <>
                <Text style={styles.profileText}>Welcome, {user.email}</Text>
                <Pressable onPress={handleLogOut} style={styles.logoutButton}>
                  <Text style={styles.logoutText}>Logout</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.loginText}>Login to your Profile</Text>
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
                <Pressable onPress={handleSubmit} style={styles.submitButton}>
                  <Text style={styles.submitText}>Submit</Text>
                </Pressable>
                <Link href='signup' style={styles.signupLink}>
                  <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
                </Link>
              </>
            )}
          </View>
        )
        }
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal} // Close modal when back button is pressed on Android
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>No Account Found</Text>
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </Modal>
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
  profileContainer: {
    width: '100%',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
  loginText: {
    fontSize: 20,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
  signupLink: {
    alignItems: 'center',
  },
  signupText: {
    color: '#71B16E',
    fontSize: 16,
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
    backgroundColor: '#41B06E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;