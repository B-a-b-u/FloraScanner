import { View, Text, StyleSheet, Image, ScrollView, Pressable, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import FlipCard from 'react-native-flip-card';

const Cards = ({ title, image = require("../../assets/images/default_plant_image.png"), isExplored, plantData }) => {
    console.log("Cards : ", plantData);
    const [plantLocations, setPlantLocations] = useState([]);
    const [plantDates, setPlantDates] = useState([]);
    const [plantTimes, setPlantTimes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if (plantData) {
            setPlantLocations(plantData.locations);

            let dates = [];
            let times = [];
            for (let i = 0; i < plantData.dates.length; i++) {
                const dateobj = new Date(plantData.dates[i]);
                const date = dateobj.toLocaleDateString();
                const time = dateobj.toLocaleTimeString();
                dates.push(date);
                times.push(time);
            }
            setPlantDates(dates);
            setPlantTimes(times);
        }
    }, [plantData]);

    const handleExploration = () => {
        setIsModalVisible(true);
    }

    const closeModal = () => {
        setIsModalVisible(false);
    }


    return (
        <>
            <FlipCard
                friction={6}
                perspective={10000}
                flipHorizontal={true}
                flipVertical={false}
                flip={false}
                clickable={true}
                onFlipEnd={(isFlipEnd) => { console.log('isFlipEnd', isFlipEnd) }}
            >
                {/* Face Side */}
                <View style={styles.card}>
                    <View style={styles.cardImageContainer}>
                        <Image source={image} style={styles.cardImage} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text>{isExplored ? title : "UnExplored"}</Text>
                    </View>
                </View>
                {/* Back Side */}
                {isExplored ? (
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Text>{title}</Text>
                        </View>
                        <View style={styles.cardImageContainer}>
                            <Pressable onPress={handleExploration} style={styles.Plantbutton}>
                                <Text style={styles.buttonText}>View Plant Details</Text>
                            </Pressable>

                            <View style={styles.cardContent}>
                            <Pressable onPress={handleExploration} style={styles.Explorebutton}>
                                <Text style={styles.buttonText}>View Exploration Details</Text>
                            </Pressable>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Text>UnExplored Plant</Text>
                        </View>
                        <View style={styles.cardImageContainer}>
                            <Image source={require("../../assets/images/unexplored.png")} style={styles.cardImage} />
                        </View>
                    </View>
                )}
            </FlipCard>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView contentContainerStyle={styles.modalContent}>
                            <Text style={styles.modalTitle}>Exploration Details:</Text>
                            {plantLocations.map((location, index) => (
                                <View key={index} style={styles.modalItem}>
                                    <View style={styles.plantItem}>
                                    <Text style={styles.modalItemText}><Text style={styles.detailTitle}>Location:</Text> {location}</Text>
                                    <Text style={styles.modalItemText}><Text style={styles.detailTitle}>Date:</Text> {plantDates[index]}</Text>
                                    <Text style={styles.modalItemText}><Text style={styles.detailTitle}>Time:</Text> {plantTimes[index]}</Text>
                                    </View>
                                </View>
                            ))}
                            <Pressable style={styles.closeButton} onPress={closeModal}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        elevation: 4,
        backgroundColor: "#fff",
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 3,
        padding: 15,
        margin: 10,
        width: 250,
    },
    cardContent: {
        marginTop: 10,
        alignItems: 'center',
    },
    cardImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    Explorebutton: {
        backgroundColor: "#71CF4C",
        padding: 10,
        borderRadius: 5,
    },
    Plantbutton: {
        backgroundColor: "#91CF4C",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '90%',
        maxHeight: '80%',
    },
    modalContent: {
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalItem: {
        marginBottom: 10,
    },
    modalItemText: {
        fontSize: 16,
        marginBottom: 5,
    },
    detailTitle: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    closeButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    plantItem: {
        backgroundColor: '#E2EAF4',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
      },
});

export default Cards;
