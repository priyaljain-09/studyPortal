import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {ArrowLeft, Circle, CheckCircle2} from 'lucide-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {
  fetchAssigmentQuestions,
  submitAssimentQuestion,
} from '../../redux/slice/dashboard';

type Props = NativeStackScreenProps<RootStackParamList, 'AssignmentQuestions'>;

const AssignmentQuestions: React.FC<Props> = ({navigation, route}) => {
  const {assignmentId, color} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const {allQuestions} = useSelector((state: RootState) => state.dashboardData);
  //   const assignment = useSelector((state: RootState) =>
  //     state.dashboardData.allAssignment.find(a => a.id === assignmentId)
  //   );

  useEffect(() => {
    dispatch(fetchAssigmentQuestions(assignmentId));
  }, [assignmentId]);

  const [answers, setAnswers] = useState<{[key: number]: string}>({});

  const handleMCQSelect = (questionId: number, optionId: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId.toString(),
    }));
  };

  const handleTextChange = (questionId: number, text: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleSubmit = async () => {
    const payload = Object.keys(answers).map(questionId => ({
      question_id: parseInt(questionId, 10),
      answer: answers[parseInt(questionId, 10)],
    }));

    console.log('Submitting Payload:', payload);

    const res = await dispatch(submitAssimentQuestion(assignmentId, payload));
    if (res === 200) {
      Alert.alert(
        'Submitted',
        'Your answers have been submitted successfully!',
      );
      navigation.goBack();
    }
  };

  if (!allQuestions) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Assignment not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color} barStyle="light-content" />

      <View style={[styles.header, {backgroundColor: color}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{allQuestions.title}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={color} />
        </View>
      ) : (
      <ScrollView contentContainerStyle={styles.content}>
        {allQuestions?.questions?.length > 0 &&
          allQuestions?.questions.map((q: any, index: number) => (
            <View key={q.id} style={styles.questionBlock}>
              <Text style={styles.questionText}>
                {index + 1}. {q.question_text.replace(/<[^>]+>/g, '')}
              </Text>

              {q.question_type === 'mcq' && q.options && (
                <View style={styles.optionsContainer}>
                  {q.options.map((option: any) => (
                    <TouchableOpacity
                      key={option.id}
                      style={styles.option}
                      onPress={() => handleMCQSelect(q.id, option.id)}>
                      {answers[q.id] === option.id.toString() ? (
                        <CheckCircle2 size={20} color="#22c55e" />
                      ) : (
                        <Circle size={20} color="#6b7280" />
                      )}
                      <Text style={styles.optionText}>{option.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {q.question_type === 'text' && (
                <TextInput
                  style={styles.textInput}
                  placeholder="Type your answer here"
                  value={answers[q.id] || ''}
                  onChangeText={text => handleTextChange(q.id, text)}
                  multiline
                />
              )}
            </View>
          ))}
      </ScrollView>
      )}
      <View style={[styles.submitContainer, {backgroundColor: '#fff'}]}>
        <TouchableOpacity
          style={[styles.submitButton, {backgroundColor: color}]}
          onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Assignment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AssignmentQuestions;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  questionBlock: {
    marginBottom: 20,
    borderBottomWidth: 0.7,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
    color: '#111827',
  },
  optionsContainer: {
    marginLeft: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#374151',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#111827',
    marginTop: 8,
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },

  submitButton: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
