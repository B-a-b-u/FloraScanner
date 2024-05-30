import { View, Text, SafeAreaView, Image, StyleSheet, Pressable } from 'react-native'
import { Link } from 'expo-router';



const HomeLayout = () => {

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/Focus-amico.png")}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text style={styles.title}>Welcome to Flora Scanner App</Text>
      <Text style={styles.subtitle}>Explore about the Plants in just a click</Text>

      <Pressable style={styles.button}>
        <Link href={"cards_page"} style={styles.buttonText}>
          Explore Plants
        </Link>
      </Pressable>
      
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 5,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    fontStyle: "italic",
    color: '#555',
  },
  button: {
    backgroundColor: '#71CF4C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
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

export default HomeLayout;