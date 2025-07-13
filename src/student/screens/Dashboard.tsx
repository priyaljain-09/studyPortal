import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  Menu,
  Settings,
  Calendar,
  Bell,
  Mail,
  Home,
  MoreVertical,
  FileText,
} from 'lucide-react-native';
import Sidebar from '../../components/Sidebar';
import BottomNavigation from '../../components/BottomNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchDashboardSubject} from '../../redux/slice/dashboard';

interface Course {
  id: number;
  title: string;
  description: string;
  color: string;
}

interface CourseCardProps {
  course: Course;
  onPress: (course: Course) => void;
}

interface DashboardProps {
  navigation: any;
}

const Dashboard: React.FC<DashboardProps> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const {allSubjects} = useSelector((state: RootState) => state.dashboardData);

  const subjectColors = [
    '#6B7280', // Gray
    '#BE185D', // Pink
    '#0891B2', // Cyan
    '#A16207', // Amber
    '#3B82F6', // Blue
    '#10B981', // Green
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#F59E0B', // Yellow
    '#0EA5E9', // Sky
  ];

  useEffect(() => {
    dispatch(fetchDashboardSubject());
  }, []);

  const courses: Course[] =
    allSubjects?.subjects?.map((subject: any, index: number) => ({
      id: subject.id,
      title: subject.name,
      description: subject.description || '', // Adjust if needed
      color: subjectColors[index % subjectColors.length],
    })) || [];
  const handleCoursePress = (course: Course) => {
    navigation.navigate('CourseDetail', {course});
  };

  const CourseCard: React.FC<CourseCardProps> = ({course, onPress}) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress(course)}
      activeOpacity={0.8}>
      <View style={[styles.header, {backgroundColor: course.color}]}>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={e => {
            e.stopPropagation();
          }}>
          <MoreVertical size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <Text style={styles.courseTitle}>{course.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <View></View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarVisible(true)}>
          <Menu size={24} color="#374151" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoIcon} />
          </View>
        </View>

        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        <View style={styles.coursesHeader}>
          <Text style={styles.coursesHeading}>Courses</Text>
          <TouchableOpacity>
            <Text style={styles.allCoursesLink}>All courses</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.coursesList}>
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={handleCoursePress}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} activeTab="Dashboard" />

      {/* Sidebar Component */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  cardContainer: {
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    // marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuButton: {
    padding: 8,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  settingsButton: {
    padding: 8,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  coursesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  details: {
    padding: 12,
    backgroundColor: '#fff',
  },
  coursesHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 13,
    color: '#666',
  },
  allCoursesLink: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  coursesList: {
    gap: 16,
  },
  courseCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    minHeight: 120,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseContent: {
    flex: 1,
    paddingRight: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
    lineHeight: 24,
  },
  courseSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  moreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Dashboard;
