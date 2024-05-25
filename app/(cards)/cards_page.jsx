import { View, Text, SafeAreaView, Image, StyleSheet, ScrollView, Pressable } from 'react-native'
import { getDoc, doc, getFirestore, setDoc, onSnapshot, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { useState, useEffect } from 'react';
import Cards from './cards';


const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MSG_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENTID
};
const app = initializeApp(firebaseConfig);

const CardsPage = () => {

  const [exploredPlants, setExploredPlants] = useState({});
  const [allPlants, setAllPlants] = useState([]);
  const [allPlantsData, setAllPlantsData] = useState({});

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const db = getFirestore(app);
      if (user) {
        const userCollection = doc(db, 'UserHistory', user.email);
        onSnapshot(userCollection, (doc) => {
          fetchUserPlants(user.email);
        })

      }
      const plantsCollection = collection(db, "PlantsData");
      onSnapshot(plantsCollection, () => {
        fetchAllPlants();
      })

    });

    return () => unsubscribe();
  }, []);

  const fetchUserPlants = async (email) => {

    try {
      const db = getFirestore(app);
      const userCollection = doc(db, 'UserHistory', email);
      console.log("user collection for user plants", userCollection);
      const docSnapshot = await getDoc(userCollection);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        let plantobj = new Object();
        for (let index = 0; index < data.plants.length; index++) {
          let plant = data.plants[index].plantName;
          if (plantobj.hasOwnProperty(plant)) {
            plantobj[plant]["locations"].push(data.plants[index].location);
            plantobj[plant]["dates"].push(data.plants[index].dateTime);
          }
          else {
            plantobj[plant] = {
              "locations": [data.plants[index].location],
              "dates": [data.plants[index].dateTime],
            }
          }

        }
        console.log("Plant Object : ", plantobj);
        setExploredPlants(plantobj);
      }
      else {
        console.log("User has Explored No plants");
      }
    }
    catch (error) {
      console.error("Fetch users plants error : ", error);
    }
  }

  const fetchAllPlants = async () => {

    try {
      const db = getFirestore(app);
      const plantCollection = collection(db, "PlantsData");
      console.log("collection for  plants", plantCollection);
      const plantDocSnapshot = await getDocs(plantCollection);
      if (plantDocSnapshot) {
        const plants = [];
        const plantsData = {}
        plantDocSnapshot.forEach(docs => {
          plantsData[docs.id] = docs.data();
          plants.push(docs.id);
        });
        console.log("all plants : ", plants, plantsData);
        setAllPlants(plants);
        setAllPlantsData(plantsData);
      }
      else {
        console.log("No Plant data found");
      }
    }
    catch (error) {
      console.error("Fetch All plants Error", error);
    }


  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Try to Reveal these Plants </Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {allPlants.map((name, index) => {
          const explored = exploredPlants.hasOwnProperty(name);
          return (
            <Pressable key={index} style={styles.cardContainer}>
              <Cards
                isExplored={explored}
                title={name}
                plantData={explored ? exploredPlants[name] : null}
                medicinalData={explored ? allPlantsData[name] : null}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 50,
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

  featuresContainer: {
    marginTop: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featureItem: {
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
  },
});

export default CardsPage