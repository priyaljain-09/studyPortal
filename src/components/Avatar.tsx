import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

// Function to generate light pastel color from a string (for consistency)
const getColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = str?.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 60%, 60%)`;
};

interface AvatarProps {
  label: string; // Single character or name
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({label, size = 40}) => {
  const bgColor = useMemo(() => getColorFromString(label), [label]);

  return (
    <View
      style={[
        styles.avatar,
        {
          backgroundColor: bgColor,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}>
      <Text style={[styles.text, {fontSize: size * 0.5}]}>
        {label.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '700',
  },
});
