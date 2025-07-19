// AssignmentList.tsx
import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
} from 'react-native';
import {RootStackParamList} from '../../types/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {
  FileText,
  Lock,
  CheckCircle,
  XCircle,
  MinusCircle,
  ChevronUp,
  ArrowLeft,
} from 'lucide-react-native';
import {fetchAssignmentBySubject} from '../../redux/slice/dashboard';
import RenderHTML from 'react-native-render-html';

type Props = NativeStackScreenProps<RootStackParamList, 'AssignmentList'>;

const AssignmentList: React.FC<Props> = ({navigation, route}) => {
  const {course} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const {allAssignment} = useSelector(
    (state: RootState) => state.dashboardData,
  );
  const {width} = useWindowDimensions();

  const today = new Date();

  const getStatusIconAndColor = (item: any) => {
    const dueDate = new Date(item.due_date);

    if (item.submitted) {
      return {
        icon: <CheckCircle size={14} color="#22c55e" />, // Green
        color: '#22c55e',
        text: 'Submitted',
      };
    } else if (!item.submitted && dueDate < today) {
      return {
        icon: <XCircle size={14} color="#ef4444" />, // Red
        color: '#ef4444',
        text: 'Not Submitted',
      };
    } else {
      return {
        icon: <MinusCircle size={14} color="#facc15" />, // Yellow
        color: '#facc15',
        text: 'Pending',
      };
    }
  };

  const getAssignmentIcon = (item: any) => {
    return item.isClosed ? (
      <Lock size={18} color="#6b7280" />
    ) : (
      <FileText size={18} color="#c147e9" />
    );
  };

  useEffect(() => {
    dispatch(fetchAssignmentBySubject(course.id));
  }, [course.id]);

  const renderAssignmentItem = ({item, index}: {item: any; index: number}) => {
    const statusInfo = getStatusIconAndColor(item);

    const handlePress = () => {
      if (item.submitted) {
        Alert.alert(
          'Already Submitted',
          'You have already submitted this assignment.',
          [{text: 'OK'}],
        );
      } else {
        navigation.navigate('AssignmentQuestions', {
          assignmentId: item.id,
          color: course.color,
        });
      }
    };

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.assignmentItem}>
          <View style={styles.iconContainer}>{getAssignmentIcon(item)}</View>

          <View style={styles.textContainer}>
            <Text style={styles.assignmentTitle}>{item.title}</Text>
            <RenderHTML
              contentWidth={width}
              source={{html: item.description}}
              tagsStyles={{
                p: {
                  margin: 0,
                  padding: 0,
                  lineHeight: 20,
                  fontSize: 14,
                  color: '#6b7280',
                },
              }}
              baseStyle={styles.assignmentDescription}
            />
            <Text style={styles.assignmentDescription}>{item.due_date}</Text>

            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                {statusInfo.icon}
                <Text style={[styles.statusText, {color: statusInfo.color}]}>
                  {statusInfo.text}
                </Text>
              </View>

              <Text
                style={[
                  styles.marksText,
                  {color: item.submitted ? '#c147e9' : '#6b7280'},
                ]}>
                {item.submitted
                  ? `✔️ ${item.total_marks} Marks`
                  : `- / ${item.total_marks}`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.gradingPeriodContainer}>
        <Text style={styles.gradingPeriodLabel}>Grading Period:</Text>
        <Text style={styles.gradingPeriodValue}>All</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={course.color} barStyle="light-content" />

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={course.color} />
        </View>
      ) : (
        <>
          <View style={[styles.header, {backgroundColor: course.color}]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={navigation.goBack}>
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>{course.title}</Text>
          </View>

          <FlatList
            data={allAssignment}
            renderItem={renderAssignmentItem}
            keyExtractor={item => item.id.toString()}
            ListHeaderComponent={renderHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default AssignmentList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  pageTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  listHeader: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  gradingPeriodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  gradingPeriodLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  gradingPeriodValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 0.7,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  assignmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.7,
    borderBottomColor: '#ddd',
  },
  iconContainer: {
    marginTop: 3,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  assignmentDescription: {
    fontSize: 13,
    lineHeight: 14,
    padding: 0,
    color: '#6b7280',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '500',
  },
  marksText: {
    fontSize: 13,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
