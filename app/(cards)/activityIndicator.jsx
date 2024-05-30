// // activityIndicator.jsx
// import React, { useEffect, useRef } from 'react';
// import { View, Image, StyleSheet, Animated, Easing } from 'react-native';

// const CustomActivityIndicator = ({ imageSource, size = 100 }) => {
//     const rotation = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//       const rotateAnimation = Animated.loop(
//         Animated.timing(rotation, {
//           toValue: 1,
//           duration: 2000,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         })
//       );
  
//       rotateAnimation.start();
  
//       return () => rotateAnimation.stop();
//     }, [rotation]);
  
//     const rotateInterpolate = rotation.interpolate({
//       inputRange: [0, 1],
//       outputRange: ['0deg', '360deg'],
//     });
  
//     const animatedStyle = {
//       transform: [{ rotate: rotateInterpolate }],
//     };
  
//     return (
//       <View style={[styles.container, { width: size, height: size }]}>
//         <Animated.Image
//           source={imageSource}
//           style={[styles.image, animatedStyle, { width: size, height: size }]}
//           resizeMode="contain"
//         />
//       </View>
//     );
//   };
  
//   const styles = StyleSheet.create({
//     container: {
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     image: {
//       width: '100%',
//       height: '100%',
//     },
//   });
  
//   export default CustomActivityIndicator;

import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CustomActivityIndicator = ({show}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Function to hide the image after a specified duration
  useEffect(() => {
    console.log('Timer started');
    const timer = setTimeout(() => {
      setIsVisible(show);
      console.log('Timer expired, isVisible set to false');
    }); // Change 9000 to the desired duration in milliseconds

    // Clean up the timer
    return () => {
      clearTimeout(timer);
      console.log('Timer cleared');
    };
  }, []);

  return (
    <View style={styles.container}>
      {isVisible && (
        <Image
          source={require('../../assets/gifs/ai4.gif')}
          resizeMethod='contain'
          style={styles.image}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default CustomActivityIndicator;