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
  useWindowDimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {ArrowLeft} from 'lucide-react-native';
import RenderHTML from 'react-native-render-html';
import ModuleBanner from '../../components/Banner';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseHome'>;

const CourseHome: React.FC<Props> = ({navigation, route}) => {
  const {course} = route.params;
  const {width} = useWindowDimensions();

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
          <ModuleBanner moduleTitle={course.title} />
          <Text style={styles.sectionTitle}>About this course</Text>
          <RenderHTML
            contentWidth={width}
            source={
              course?.description
                ? {html: course?.description}
                : {html: '<p>No announcement content available.</p>'}
            }
            tagsStyles={{
              p: {fontSize: 16, color: '#444', marginBottom: 8, lineHeight: 22},
              strong: {fontWeight: '700'},
              li: {
                marginBottom: 4,
                fontSize: 16,
                color: '#444',
                lineHeight: 22,
              },
              ul: {marginBottom: 8, paddingLeft: 20},
              br: {marginBottom: 4},
            }}
          />
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
    flex: 1,
    gap: 20,
  },
  backButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
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
