import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {ArrowLeft} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseHome'>;

const CourseHome: React.FC<Props> = ({navigation, route}) => {
  const {course} = route.params;

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={course.color} barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.header, {backgroundColor: course.color}]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>{course.title}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this course</Text>
          <Text style={styles.sectionText}>{course.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  scrollContainer: {paddingBottom: 100},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
    paddingVertical: 10,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  section: {
    padding: 20,
  },
  backButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1A1A1A',
  },
  sectionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
});

export default CourseHome;
