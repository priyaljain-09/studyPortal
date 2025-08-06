import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AssignmentSubmit'>;

const AssignmentSubmit: React.FC<Props> = ({navigation, route}) => {
  const {color, course} = route.params || {};

  const handleBackToAssignments = () => {
    navigation.navigate('AssignmentList', {course});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Submission</Text>
        <Text style={styles.title}>Assignment Submitted</Text>
        <Text style={styles.description}>
          Your assignment has been successfully submitted. You can view your
          submission in the assignments list.
        </Text>

        <Image
          source={require('../../../assets/download.jpg')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleBackToAssignments}>
          <Text style={[styles.buttonText]}>Back to Assignments</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AssignmentSubmit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  image: {
    width: 280,
    height: 180,
    borderRadius: 10,
    marginBottom: 40,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    backgroundColor: '#dbeafe',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
});
