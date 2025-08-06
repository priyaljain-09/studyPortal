import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
// import Image from "../../assets/download.jpeg"

interface ModuleBannerProps {
  moduleTitle?: string;
}

const ModuleBanner: React.FC<ModuleBannerProps> = ({ moduleTitle }) => {
  return (
    <View style={styles.banner}>
      <View style={styles.imageWrapper}>
        <ImageBackground
          source={require("../../assets/download.jpg")}
          style={styles.image}
          resizeMode="cover"
        >
          <Text style={styles.moduleTitle}>{moduleTitle}</Text>
        </ImageBackground>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 250,
    alignItems: "center",
    justifyContent: 'center',
    padding: 20,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  moduleTitle: {
    color: '#fff',
    fontSize: 26,
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
});


export default ModuleBanner;
