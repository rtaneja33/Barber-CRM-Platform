import React, { useState } from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet, Animated, titleStyle} from 'react-native';

const SubmitFormButton = ({ title, onPress, style, titleStyle}) => {
  const [offset] = useState(new Animated.Value(1));
  const [scale] = useState(new Animated.Value(1));
  const handlePress = () => {
    Animated.spring(offset, {
      toValue: 5,
      useNativeDriver: false
    }).start();
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: false
    }).start();
    
  };
  const handlePressOut = () => {
    onPress()
    Animated.spring(offset, {
        toValue: 0,
        useNativeDriver: false
      }).start();
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: false
      }).start();
  }

  const transform = [
    { translateY: offset },
    { scaleY: scale },
    { scaleX: scale },
  ];

  console.log("style is", style)
      console.log("title style is", titleStyle)
  return (
    <TouchableWithoutFeedback onPressIn={handlePress} onPressOut={handlePressOut}>
      <Animated.View style={{ transform, ...styles.container, ...style }}>
        <Text style={[styles.text, { ...titleStyle }]} >{title}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: '#3F5EFB',
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    width: "100%",
    elevation: 4,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 80,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubmitFormButton;