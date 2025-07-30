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
  const {assignmentId, color, course} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const {allQuestions} = useSelector((state: RootState) => state.dashboardData);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});

  useEffect(() => {
    dispatch(fetchAssigmentQuestions(assignmentId));
  }, [assignmentId]);

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

    const res = await dispatch(submitAssimentQuestion(assignmentId, payload));
    if (res === 200) {
       navigation.replace('AssignmentSubmit', {
        assignmentId: assignmentId,
        color: color,
        course: course
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  if (!allQuestions) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Assignment not found.</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = allQuestions.questions[currentQuestionIndex];
  console.log("all", allQuestions.questions, currentQuestion)
  const totalQuestions = allQuestions.questions.length;
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {backgroundColor: color}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz</Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={color} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </Text>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBar,
                  {width: `${progressPercentage}%`, backgroundColor: "#BDBDBB"},
                ]}
              />
            </View>
          </View>

          {currentQuestion.length > 0 && <View key={currentQuestion.id} style={styles.questionBlock}>
            <Text style={styles.questionText}>
              {currentQuestionIndex + 1}.{' '}
              {currentQuestion?.question_text?.replace(/<[^>]+>/g, '')}
            </Text>
            {console.log(currentQuestion)}

            {currentQuestion.question_type === 'mcq' &&
              currentQuestion.options && (
                <View style={styles.optionsContainer}>
                  {currentQuestion.options.map((option: any) => (
                    <TouchableOpacity
                      key={option.id}
                      style={styles.option}
                      onPress={() =>
                        handleMCQSelect(currentQuestion.id, option.id)
                      }>
                      {answers[currentQuestion.id] === option.id.toString() ? (
                        <CheckCircle2 size={20} color="#22c55e" />
                      ) : (
                        <Circle size={20} color="#6b7280" />
                      )}
                      <Text style={styles.optionText}>{option.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

            {currentQuestion.question_type === 'text' && (
              <TextInput
                style={styles.textInput}
                placeholder="Type your answer here"
                value={answers[currentQuestion.id] || ''}
                onChangeText={text =>
                  handleTextChange(currentQuestion.id, text)
                }
                multiline
              />
            )}
          </View>}
        </ScrollView>
      )}

      {/* Navigation Buttons */}
      <View style={styles.submitContainer}>
        {currentQuestionIndex === totalQuestions - 1 ? (
          <TouchableOpacity
          style={[styles.submitButton, {backgroundColor: color}]}            onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
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
    paddingTop: 60,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  progressSection: {
    flex: 1,
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#111827',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    borderRadius: 10,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  questionBlock: {
    marginBottom: 20,
    paddingBottom: 10,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '500',
    marginVertical: 20,
    color: '#111827',
  },
  optionsContainer: {
    marginLeft: 10,
    gap: 20,
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
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  nextButton: {
    backgroundColor: '#DCE7F3',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  nextButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
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
