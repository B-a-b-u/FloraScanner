import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import React from 'react'
import FlipCard from 'react-native-flip-card';

const Cards = ({ title, image = require("../../assets/images/default_plant_image.png"), isExplored, plantData }) => {
    console.log("Cards : ", plantData);
    if(plantData){
        const locations = plantData.locations;
        const dateTime = plantData.dates;
        console.log("Cards locations and date: ",locations,dateTime);
    }
    
    return (


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
                    <Text>{isExplored == true ? title : "UnExplored"}</Text>
                </View>
            </View>
            {/* Back Side */}
            {isExplored == false ?
                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <Text>UnExplored Plant</Text>
                    </View>
                    <View style={styles.cardImageContainer}>
                        <Image source={require("../../assets/images/unexplored.png")} style={styles.cardImage} />

                    </View>

                </View>
                :
                <>
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Text>{title}</Text>
                        </View>
                        <View style={styles.cardImageContainer}>
                            <ScrollView>
                            </ScrollView>
                        </View>

                    </View>
                </>
            }

        </FlipCard>
    )
}

const styles = StyleSheet.create({
    card: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#ddd",
        elevation: 5,
        backgroundColor: "#fff",
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 3,
        padding: 10,
        margin: 10,
        width: 250,
        //   backgroundColor : "#000000",
    },
    cardContent: {
        marginTop: 10,
        alignItems: "center",

    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
    cardImageContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        height: 200,
        borderRadius: 10,
        overflow: "hidden",

    },
    cardImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});

export default Cards;