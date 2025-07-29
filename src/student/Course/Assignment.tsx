// AssignmentList.tsx
import React, {useEffect, useState} from 'react';
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
import BottomNavigation from '../../components/BottomNavigation';
import CourseTabs, {TabItem} from '../../components/Tabs';
import {tabs} from '../../utils/constant';

type Props = NativeStackScreenProps<RootStackParamList, 'AssignmentList'>;

const AssignmentList: React.FC<Props> = ({navigation, route}) => {
  const {course} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const [activeTab, setActiveTab] = useState('Assigments');
  const {allAssignment} = useSelector(
    (state: RootState) => state.dashboardData,
  );
  const {width} = useWindowDimensions();

  const today = new Date();

  const handleBackPress = () => {
    navigation.navigate('CourseDetail', {course});
  };

  const handleTabPress = (tab: TabItem) => {
    setActiveTab(tab.label);
    if (tab.route && tab.route !== 'Assigments') {
      navigation.navigate(tab.route as any, {course: route.params.course});
    }
  };

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
        navigation.navigate('AssigmentDetails', {
          assignmentId: item.id,
          courseColor: course.color,
          course: course,
        });
      }
    };

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.assignmentItem}>
          <View style={styles.iconContainer}>{getAssignmentIcon(item)}</View>

          <View style={styles.textContainer}>
            <Text style={styles.assignmentTitle}>{item.title}</Text>
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

  return (
    <View style={[styles.container, {backgroundColor: course.color}]}>
      <StatusBar backgroundColor={course.color} barStyle="light-content" />
      <View style={[styles.header, {backgroundColor: course.color}]}>
        <TouchableOpacity style={styles.headerTop} onPress={handleBackPress}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{course.title}</Text>
        </View>
      </View>
      <View style={styles.mainContent}>
        <View>
          <CourseTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />

          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={course.color} />
            </View>
          ) : (
            <FlatList
              data={allAssignment}
              renderItem={renderAssignmentItem}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
      <BottomNavigation navigation={navigation} activeTab="Dashboard" />
    </View>
  );
};

export default AssignmentList;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerTop: {
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  headerContent: {
    marginVertical: 30,
  },
  headerTitle: {
    color: 'white',
    fontSize: 38,
    fontWeight: 500,
  },
  container: {flex: 1, backgroundColor: '#fff'},
  mainContent: {
    flex: 1,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
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
