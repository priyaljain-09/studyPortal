// src/screens/CourseDetail.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  ChevronRight,
  Home,
  Megaphone,
  BookOpen,
  Users,
  MessageSquare,
  FileEdit,
  GraduationCap,
  ClipboardList,
} from 'lucide-react-native';
import BottomNavigation from '../components/BottomNavigation';
import { RootStackParamList } from '../types/types'; // path to your param list
import { NativeStackScreenProps } from '@react-navigation/native-stack';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
}

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

const CourseDetail: React.FC<Props> = ({ navigation, route }) => {
  const { course } = route.params;

  const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={course.color} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: course.color }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{course.subtitle}</Text>
        
        <View style={styles.placeholder} />
      </View>

      {/* Course Info Section */}
      <View style={[styles.courseInfoSection, { backgroundColor: course.color }]}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseSemester}>PGRD Semester 1 2025 (2510)</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        <MenuItem 
          icon={<Home size={20} color="#BE185D" />}
          title="Home"
          onPress={() => console.log('Home pressed')}
        />
        
        <Text style={styles.subText}>Front page</Text>
        
        <MenuItem 
          icon={<Megaphone size={20} color="#BE185D" />}
          title="Announcements"
          onPress={() => console.log('Announcements pressed')}
        />
        
        <MenuItem 
          icon={<BookOpen size={20} color="#BE185D" />}
          title="Syllabus"
          onPress={() => console.log('Syllabus pressed')}
        />
        
        <MenuItem 
          icon={<Users size={20} color="#BE185D" />}
          title="Modules"
          onPress={() => console.log('Modules pressed')}
        />
        
        <MenuItem 
          icon={<MessageSquare size={20} color="#BE185D" />}
          title="Discussions"
          onPress={() => console.log('Discussions pressed')}
        />
        
        <MenuItem 
          icon={<FileEdit size={20} color="#BE185D" />}
          title="Assignments"
          onPress={() => console.log('Assignments pressed')}
        />
        
        <MenuItem 
          icon={<GraduationCap size={20} color="#BE185D" />}
          title="Grades"
          onPress={() => console.log('Grades pressed')}
        />
        
        <MenuItem 
          icon={<ClipboardList size={20} color="#BE185D" />}
          title="Student Surveys"
          onPress={() => console.log('Student Surveys pressed')}
        />
      </ScrollView>

      {/* Bottom Navigation Component */}
      <BottomNavigation navigation={navigation} activeTab="Dashboard" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  courseInfoSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
    backgroundColor: "red",
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 34,
  },
  courseSemester: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  subText: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 60,
    paddingVertical: 4,
    marginBottom: 8,
  },
});

export default CourseDetail;