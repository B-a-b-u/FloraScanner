import { View,TextInput,Image, Text, Pressable,StyleSheet,SafeAreaView, KeyboardAvoidingView,ActivityIndicator, Modal, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { onAuthStateChanged, getAuth, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'expo-router';
import { getFirestore, doc, getDoc, onSnapshot, getDocs } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyB4cn83vwE7UJlyr-eH5l4hnk56YiySj0s",
  authDomain: "florascanner-4f4ff.firebaseapp.com",
  projectId: "florascanner-4f4ff",
  storageBucket: "florascanner-4f4ff.appspot.com",
  messagingSenderId: "57419221422",
  appId: "1:57419221422:web:b827a7ffa828aeddf2203f",
  measurementId: "G-X52047XLNC"
};

const app = initializeApp(firebaseConfig);


const Profile = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const auth = getAuth(app);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const db = getFirestore(app);
        const userDocRef = doc(db, 'UserHistory', user.email);
        onSnapshot(userDocRef,(doc) => {
            fetchUserPlants(user.email)
        })
        fetchUserPlants(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const auth = getAuth(app);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error.message);
      setShowModal(true);
    } finally {
      setEmail('');
      setPassword('');
      setIsLoading(false);
    }
  };

  const fetchUserPlants = async (email) => {
    setIsLoading(true);
    const db = getFirestore(app);
    const userDocRef = doc(db, 'UserHistory', email);

    try {
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setPlants(data.plants || []);
      } else {
        console.log("No user document found");
      }
      }
     catch (error) {
      console.error('Error fetching user plants:', error);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogOut = async () => {
    setIsLoading(true);
    const auth = getAuth();
    await signOut(auth);
    setIsLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
      <View style={styles.imageContainer}>
          <Image style={styles.image} source={require("../../assets/images/login_image.png")} />
        </View>
        {isLoading ? <ActivityIndicator size="large" /> : (
          <View style={styles.profileContainer}>
            {user ? (
              <>
                <Text style={styles.profileText}>Welcome, {user.email}</Text>
                <Pressable onPress={handleLogOut} style={styles.logoutButton}>
                  <Text style={styles.logoutText}>Logout</Text>
                </Pressable>
                {plants.length > 0 ? (
                  <ScrollView style={styles.plantsContainer}>
                    <Text style={styles.plantsHeading}>Explored Plants</Text>
                    {plants.map((plant, index) => (
                      <Text key={index} style={styles.plant}>{plant}</Text>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.noPlantsText}>You have no plants saved</Text>
                )}
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
        )}
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Error signing in. Please try again.</Text>
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
    backgroundColor: '#fff',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
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
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupLink: {
    alignItems: 'center',
  },
  signupText: {
    color: '#71B16E',
    fontSize: 16,
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
  plantsContainer: {
    marginTop: 20,
    width: '100%',
    maxHeight: 400,
    paddingHorizontal: 20,
  },plant: {
    fontSize: 16,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#C7FDB4',
    borderRadius: 5,
  },
  plantsHeading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
 
  noPlantsText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default Profile;