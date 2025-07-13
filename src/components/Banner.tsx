import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
// import Image from "../../assets/download.jpeg"

interface ModuleBannerProps {
  moduleTitle: string;
}

const ModuleBanner: React.FC<ModuleBannerProps> = ({ moduleTitle }) => {
  return (
    <ImageBackground
      source={require("../../assets/download.jpeg")}
      style={styles.banner}
      resizeMode="cover"
    >
      <Text style={styles.moduleTitle}>{moduleTitle}</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    // paddingHorizontal: 20,
    backgroundColor: '#ccc',
  },
  moduleTitle: {
    color: '#000',
    fontSize: 26,
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
});

export default ModuleBanner;
