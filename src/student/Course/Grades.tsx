import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import BottomNavigation from '../../components/BottomNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {ArrowLeft} from 'lucide-react-native';
import CourseTabs, {TabItem} from '../../components/Tabs';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {tabs} from '../../utils/constant';
import {fetchGradesBySubject} from '../../redux/slice/dashboard';

type Props = NativeStackScreenProps<RootStackParamList, 'Grades'>;

const Grades: React.FC<Props> = ({navigation, route}) => {
  const {course} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const [activeTab, setActiveTab] = useState('Grades');
  const {subjectGrades} = useSelector(
    (state: RootState) => state.dashboardData,
  );
  const handleBackPress = (): void => {
    navigation.navigate('CourseDetail', {course});
  };

  useEffect(() => {
    dispatch(fetchGradesBySubject(course.id));
  }, [course.id]);

  const handleTabPress = (tab: TabItem) => {
    setActiveTab(tab.label);
    if (tab.route && tab.route !== 'Grades') {
      navigation.navigate(tab.route as any, {course: route.params.course});
    }
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
            <View style={styles.section}>
              {/* <Text style={styles.sectionTitle}>Grades</Text> */}

              <FlatList
                data={subjectGrades}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.assignmentRow}
                    onPress={() =>
                      navigation.navigate('GradeDetail', {
                        gradeId: item.id,
                        courseColor: course.color,
                      })
                    }>
                    <Text style={styles.assignmentTitle}>
                      {item.assignment_title}
                    </Text>
                    <Text style={styles.assignmentScore}>
                      {item.marks_obtained !== null
                        ? `${item.marks_obtained}/${item.total_marks}`
                        : `-- / ${item.total_marks}`}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No grades available.</Text>
                  </View>
                }
              />

              {subjectGrades?.length > 5 && (
                <TouchableOpacity
                  // onPress={() => navigation.navigate('AllGrades')} // Or your route name
                  style={styles.viewAllWrapper}>
                  <Text style={styles.viewAllText}>View all ➔</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
      <BottomNavigation navigation={navigation} activeTab="Dashboard" />
    </View>
  );
};

export default Grades;

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContent: {
    flex: 1,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerWrapper: {
    backgroundColor: '#bfdbfe',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 10,
  },
  activeTabText: {
    color: '#1d4ed8',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  assignmentRow: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    elevation: 1,
  },
  assignmentTitle: {
    fontSize: 15,
    color: '#111827',
  },
  assignmentScore: {
    fontSize: 15,
    color: '#6b7280',
  },
  viewAllWrapper: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  viewAllText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '500',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
