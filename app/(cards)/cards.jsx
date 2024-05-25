import { View, Text, StyleSheet, Image, ScrollView, Pressable, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import FlipCard from 'react-native-flip-card';

const Cards = ({ title, image = require("../../assets/images/default_plant_image.png"), isExplored, plantData, medicinalData }) => {
    const [plantLocations, setPlantLocations] = useState([]);
    const [plantDates, setPlantDates] = useState([]);
    const [plantTimes, setPlantTimes] = useState([]);
    const [isExploreModalVisible, setIsExploreModalVisible] = useState(false);
    const [isPlantModalVisible, setIsPlantModalVisible] = useState(false);
    const [plantMedicinalData, setPlantMedicinalData] = useState(null);


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
        if (medicinalData) {
            setPlantMedicinalData(medicinalData);
        }
    }, [plantData]);

    const handleExploration = () => {
        setIsExploreModalVisible(true);
    }

    const handlePlantModal = () => {
        setIsPlantModalVisible(true);
    }

    const closeModal = () => {
        setIsExploreModalVisible(false);
        setIsPlantModalVisible(false);
    }


    return (
        <>
            <FlipCard
                friction={6}
                perspective={1000}
                flipHorizontal={true}
                flipVertical={false}
                flip={false}
                clickable={true}
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
                            <Pressable onPress={handlePlantModal} style={styles.Plantbutton}>
                                <Text style={styles.buttonText}>Plant Details</Text>
                            </Pressable>

                            <View style={styles.cardContent}>
                                <Pressable onPress={handleExploration} style={styles.Plantbutton}>
                                    <Text style={styles.buttonText}>Exploration Details</Text>
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
            {/* User Exploration Status Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isExploreModalVisible}
                onRequestClose={() => {
                    closeModal(false);
                }}
            >
                <ScrollView>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
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
                            <Pressable
                                style={styles.button}
                                onPress={() => {
                                    closeModal();
                                }}
                            >
                                <Text style={styles.buttonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </Modal>

            {/* Plant Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isPlantModalVisible}
                onRequestClose={() => {
                    setIsPlantModalVisible(false);
                }}
            >
                <ScrollView>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.resultText}>Plant Name: {title}</Text>
                            <Text style={styles.modalText}>Details</Text>
                            {plantMedicinalData && (
                                <View>
                                    <Text style={styles.detailTitle}>Scientific Name:</Text>
                                    <Text style={styles.detailText}>{plantMedicinalData.scientificName}</Text>
                                    <Text style={styles.detailTitle}>Medicinal Property:</Text>
                                    <Text style={styles.detailText}>{plantMedicinalData.medicinalProperty}</Text>
                                    <Text style={styles.detailTitle}>Medicinal Details:</Text>
                                    {plantMedicinalData.medicinalDetails && plantMedicinalData.medicinalDetails.map((detail, index) => (
                                        <Text key={index} style={styles.detailText}>{detail}</Text>
                                    ))}
                                    <Text style={styles.detailTitle}>Common Growth Location:</Text>
                                    <Text style={styles.detailText}>{plantMedicinalData.commonGrowthLocation}</Text>
                                    <Text style={styles.detailTitle}>Disclaimer:</Text>
                                    <Text style={styles.detailText}>{plantMedicinalData.disclaimer}</Text>
                                </View>
                            )}
                            <Pressable
                                style={styles.button}
                                onPress={() => {
                                    setIsPlantModalVisible(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
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
        width: '95%',
        maxHeight: '80%',
    },
    modalContent: {
        padding: 20,
        width: '95%',

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

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#fff', // Changed background color
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "90%",

    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20, // Increased font size
        fontWeight: 'bold',
        color: '#333', // Changed text color
    },
    resultText: {
        marginBottom: 10,
        fontSize: 16,
        color: '#555', // Changed text color
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    detailTitle: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    detailText: {
        flex: 1,
        color: '#777', // Changed text color
    },
    button: {
        marginTop: 15,
        backgroundColor: '#D20103',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonTextColor: {
        color: '#fff',
        fontWeight: 'bold',
    },

    detailTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 16,
        color: '#333',
    },
    detailText: {
        marginBottom: 15,
        fontSize: 14,
        color: '#555',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Cards;
