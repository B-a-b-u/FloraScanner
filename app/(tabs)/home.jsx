import { View,ScrollView, Text, SafeAreaView, Image, StyleSheet } from 'react-native'
import { getDoc, doc, getFirestore, setDoc, onSnapshot,collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { useState,useEffect } from 'react';
import Card from '../card';


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

const HomeLayout = () => {
  const [userEmail,setUserEmail] = useState('');
  const [userExploredPlants,setUserExploredPlants] = useState([]);
  const [plantNames, setPlantName] = useState([]);

  // To listen for any authentication state or Database changes
  useEffect(() => {
    const auth = getAuth(app);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user.email);
      if (user) {
        const db = getFirestore(app);
        const userCollection = doc(db, 'UserHistory', user.email);
        const plantsCollection  = collection(db,"PlantsData");
        onSnapshot(userCollection,(doc) => {
            fetchPlants(user.email);
        })
        onSnapshot(plantsCollection,() => {
          fetchPlants(user.email);
        })
      }
    });

    return () => unsubscribe();
  }, []);

  // Getting all plants details
  const fetchPlants = async (email) => {
    const db = getFirestore(app);
    const userCollection = doc(db, 'UserHistory', email);
    const plantCollection = collection(db,"PlantsData");
    console.log("plant collection : ",plantCollection);


    try {
      const docSnapshot = await getDoc(userCollection);
      const plantDocSnapshot = await getDocs(plantCollection);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        // console.log("User Explored Plants : ",data.plants);
        const plantData = [];
        for (let index = 0; index < data.plants.length; index++) {
          plantData.push(data.plants[index].plantName);
        }
        console.log("plant names  :",plantData);
        setUserExploredPlants(plantData);
      } else {
        console.log("No user document found");
      }
      const plantNames = [];
      plantDocSnapshot.forEach(docs => {
        console.log("PC data : ",docs.id);
        plantNames.push(docs.id);
      });
      setPlantName(plantNames);
      }
     catch (error) {
      console.error('Error fetching user plants:', error);
      // setShowModal(true);
    } finally {
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/Focus-amico.png')}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text style={styles.title}>Welcome to Flora Scanner App</Text>
      {userEmail && <Text>{userEmail}</Text>}
      <Text style={styles.subtitle}>Explore about the Plants in just a click</Text>

      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {plantNames.map((name, index) => (
          <Card title={name} imageUrl={require("../../assets/images/default_plant_image.png")} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  imageContainer  :{
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
  },
  image : {
    width : 100,
    height : 100,
    resizeMode : "contain",
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  cardsContainer: {
    marginTop: 20,
    width : 300,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    marginVertical: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default HomeLayout
