import { View, Text, SafeAreaView, Image, StyleSheet, ScrollView, Pressable } from 'react-native'
import { getDoc, doc, getFirestore, setDoc, onSnapshot,collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { useState,useEffect } from 'react';
import Cards from '../(components)/cards';

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
  const [email,setEmail] = useState(null);
  const [exploredPlants,setExploredPlants] = useState({});
  const [allPlants,setAllPlants] = useState([]);
  const [plantLoc,setPlantLoc] = useState([]);
  const [plantDate,setPlantDate] = useState([]);

  useEffect(() => {
    const auth = getAuth(app);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const db = getFirestore(app);
      if (user) {
        setEmail(user.email);
        const userCollection = doc(db, 'UserHistory', user.email);
        onSnapshot(userCollection,(doc) => {
            fetchUserPlants(user.email);
        })
        
      }
      const plantsCollection  = collection(db,"PlantsData");
      onSnapshot(plantsCollection,() => {
        fetchAllPlants();
      })

    });

    return () => unsubscribe();
  }, []);

const fetchUserPlants = async (email) => {
  const db = getFirestore(app);
  const userCollection = doc(db, 'UserHistory', email);
  console.log("user collection for user plants",userCollection);

  try{
    const docSnapshot = await getDoc(userCollection);
    if(docSnapshot.exists()){
      const data = docSnapshot.data();
      let userPlants = [];
      let locations = [];
      let dateTimes = [];
      let plantobj = new Object();
      for (let index = 0; index < data.plants.length; index++) {
        let plant = data.plants[index].plantName;
        if(plantobj.hasOwnProperty(plant)){
          plantobj[plant]["locations"].push(data.plants[index].location);
          plantobj[plant]["dates"].push(data.plants[index].dateTime);
        }
        else{
          plantobj[plant] = {
            "locations" :[ data.plants[index].location],
            "dates" : [data.plants[index].dateTime],
          }
        }
        
      }
     console.log("objj : ",plantobj);
      setExploredPlants(plantobj);
    }
    else{
      console.log("User has Explored No plants");
    }
  }
  catch(error){
    console.error("Fetch users plants error : ",error);
  }
}

const fetchAllPlants = async () => {
  const db = getFirestore(app);
  const plantCollection = collection(db,"PlantsData");
  console.log("collection for  plants",plantCollection);

  try{
    const plantDocSnapshot = await getDocs(plantCollection);
    if(plantDocSnapshot){
      const plants = [];
      plantDocSnapshot.forEach(docs => {
        plants.push(docs.id);
      });
      console.log("all plants : ",plants);
      setAllPlants(plants);
    }
    else{
      console.log("No Plant data found");
    }
  }
  catch(error){
    console.error("Fetch All plants Error",error);
  }


}


  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/Focus-amico.png")}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text style={styles.title}>Welcome to Flora Scanner App</Text>
      <Text style={styles.subtitle}>Explore about the Plants in just a click</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
                {allPlants.map((name, index) => {
                    const explored = exploredPlants.hasOwnProperty(name);
                    return (
                        <Pressable key={index}>
                            <Cards isExplored={explored} title={name} plantData={explored ? exploredPlants[name] : null} />
                        </Pressable>
                    );
                })}
            </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default HomeLayout