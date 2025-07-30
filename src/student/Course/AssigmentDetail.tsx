import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
  Alert,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {ArrowLeft} from 'lucide-react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchAssigmentQuestions} from '../../redux/slice/dashboard';
import ModuleBanner from '../../components/Banner';

type Props = NativeStackScreenProps<RootStackParamList, 'AssigmentDetails'>;

const AssigmentDetails: React.FC<Props> = ({navigation, route}) => {
  const {assignmentId, courseColor, course} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const {allQuestions} = useSelector((state: RootState) => state.dashboardData);
  const {width} = useWindowDimensions();

  useEffect(() => {
    dispatch(fetchAssigmentQuestions(assignmentId));
  }, [assignmentId]);

  const handleAssessment = () => {
    if (allQuestions?.questions?.length > 0) {
      navigation.navigate('AssignmentQuestions', {
        assignmentId: allQuestions.id,
        color: courseColor,
        course: course,
      });
    } else {
      Alert.alert(
        "Assessment Not Ready",
        "The assessment is currently not available. Please check back later.",
        [{ text: "OK" }]
      );
    }
  };
  

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: courseColor}]}>
      <StatusBar backgroundColor={courseColor} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {backgroundColor: courseColor}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assignments</Text>
      </View>

      <View style={styles.mainContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={courseColor} />
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}>
              <ModuleBanner />
              <Text style={styles.title}>{allQuestions.title}</Text>

              <RenderHtml
                contentWidth={width}
                source={
                  allQuestions?.description
                    ? {html: allQuestions.description}
                    : {html: '<p>No announcement content available.</p>'}
                }
                tagsStyles={{
                  p: {
                    fontSize: 16,
                    color: '#444',
                    marginBottom: 8,
                    lineHeight: 22,
                  },
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
            </ScrollView>

            {console.log('allQuestions', allQuestions?.questions)}
            {/* Fixed Bottom Button */}
            <View style={styles.bottomBar}>
              {allQuestions.assignment_type === 'mixed' ? (
                <TouchableOpacity
                  style={[styles.button, styles.quizButton]}
                  onPress={handleAssessment}>
                  <Text style={styles.quizButtonText}>Take Assessment</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.uploadButton]}
                  onPress={() => {}}>
                  <Text style={styles.uploadButtonText}>Upload File</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AssigmentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingTop: 60,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    marginBottom: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  quizButton: {
    backgroundColor: '#DCE7F3',
  },
  quizButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
