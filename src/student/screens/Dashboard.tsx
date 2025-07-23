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
  Bell,
  Search,
  Triangle,
  BookOpen,
  Building,
  Leaf,
} from 'lucide-react-native';
import Sidebar from '../../components/Sidebar';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchDashboardSubject} from '../../redux/slice/dashboard';
import BottomNavigation from '../../components/BottomNavigation';
import LinearGradient from 'react-native-linear-gradient';

interface Course {
  id: number;
  title: string;
  description: string;
  color: string;
  time: string;
  due?: number;
  icon: string;
}

interface DashboardProps {
  navigation: any;
}

const Dashboard: React.FC<DashboardProps> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const {allSubjects} = useSelector((state: RootState) => state.dashboardData);

  const subjectColors = [
    '#6B7280',
    '#BE185D',
    '#F97316', // Orange
    '#0891B2',
    '#10B981', // Green
    '#3B82F6', // Blue
    '#FACC15', // Yellow
  ];

  const subjectIcons = [Triangle, BookOpen, Building, Leaf];

  const timeSlots = [
    'Today, 10:30 AM',
    'Today, 3:30 PM',
    'Thursday, 1:00 PM',
    'Friday, 2:00 PM',
  ];

  useEffect(() => {
    dispatch(fetchDashboardSubject());
  }, []);

  const courses: Course[] =
    allSubjects?.subjects?.map((subject: any, index: number) => ({
      id: subject.id,
      title: subject.name,
      description: subject.description || 'Progress',
      color: subjectColors[index % subjectColors.length],
      time: timeSlots[index % timeSlots.length],
      due: index === 0 ? 2 : undefined,
      icon: subjectIcons[index % subjectIcons.length],
    })) || [];

  const handleCoursePress = (course: Course) => {
    navigation.navigate('CourseDetail', {course});
  };

  const SubjectCard: React.FC<{course: Course}> = ({course}) => (
    <>
    {/* {console.log("course", course)} */}
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCoursePress(course)}
      activeOpacity={0.9}>
      <View style={[styles.iconContainer, {backgroundColor: course.color}]}>
        {React.createElement(course.icon, {
          width: 30,
          height: 30,
          color: '#fff',
        })}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          {course.due && (
            <View style={styles.dueBadge}>
              <Text style={styles.dueText}>{course.due} due</Text>
            </View>
          )}
        </View>
        {/* <Text style={styles.courseSubtitle}>{course.description}</Text> */}
        <Text style={styles.courseTime}>{course.time}</Text>
      </View>
    </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <LinearGradient
        colors={['#3B82F6', '#6366F1']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}></LinearGradient>
      <LinearGradient
        colors={['#3B82F6', '#6366F1']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <TouchableOpacity onPress={() => setSidebarVisible(true)}>
              <Menu size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.greetingSection}>
              <Text style={styles.greeting}>Good morning!</Text>
              <Text style={styles.userName}>Alex Johnson</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.sectionTitle}>My Subjects</Text>
      </LinearGradient>

      {/* Remaining Subject Cards */}
      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.subjectsList}>
          {courses.map(course => (
            <SubjectCard key={course.id} course={course} />
          ))}
        </View>
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} activeTab="Dashboard" />

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    paddingVertical: 40,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  greetingSection: {
    paddingHorizontal: 16,
  },
  greeting: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  userName: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    // marginBottom: 20,
    paddingHorizontal: 16,
  },
  firstCardContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  firstCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 4,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: -30,
  },
  subjectsList: {
    gap: 16,
    paddingTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  dueBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dueText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  courseSubtitle: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4,
  },
  courseTime: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 20,
  },
});
