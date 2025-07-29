import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  ArrowLeft,
  BookOpen,
  MessageSquare,
  Megaphone,
  FileText,
  CheckCircle,
  Users,
  ClipboardList,
} from 'lucide-react-native';
import BottomNavigation from '../../components/BottomNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;
interface CardItem {
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  route?: keyof RootStackParamList;
}

const cards: CardItem[] = [
  {label: 'Modules', icon: BookOpen, color: '#8B5CF6', route: 'Modules'},
  {
    label: 'Discussion',
    icon: MessageSquare,
    color: '#F97316',
    route: 'DiscussionList',
  },
  {
    label: 'Announcements',
    icon: Megaphone,
    color: '#8B5CF6',
    route: 'CourseAnnouncements',
  },
  {label: 'Syllabus', icon: FileText, color: '#10B981'},
  {label: 'Grades', icon: CheckCircle, color: '#FACC15'},
  {label: 'People', icon: Users, color: '#3B82F6'},
  {
    label: 'Assignments',
    icon: ClipboardList,
    color: '#EF4444',
    route: 'AssignmentList',
  },
];

const CourseDetail: React.FC<Props> = ({navigation, route}) => {
  const {course} = route.params;
  const CourseIcon = course.icon;

  const renderCard = (item: CardItem, index: number) => {
    const IconComponent = item.icon;

    const handleCardPress = () => {
      if (item) {
        navigation.navigate(item.route as any, {course});
      }
    };

    return (
      <TouchableOpacity
        key={item.label}
        style={styles.card}
        onPress={handleCardPress}
        activeOpacity={0.8}>
        <IconComponent size={48} color={item.color} />
        <Text style={styles.cardLabel}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  const handleBackPress = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: course.color}]}>
      <StatusBar backgroundColor={course.color} barStyle="light-content" />
      <View style={[styles.header, {backgroundColor: course.color}]}>
        <TouchableOpacity style={styles.headerTop} onPress={handleBackPress}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <CourseIcon size={48} color="white" />
          <Text style={styles.headerTitle}>{course?.title}</Text>
        </View>
      </View>

      <LinearGradient
        colors={['#FFF0FF', '#E6EEFA']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.content}>
        <View style={styles.cardGrid}>
          {cards.map((item, index) => renderCard(item, index))}
        </View>
      </LinearGradient>

      <BottomNavigation navigation={navigation} activeTab="Dashboard" />
    </SafeAreaView>
  );
};

export default CourseDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerTop: {
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 38,
    fontWeight: 500,
    marginTop: 8,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  cardGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  card: {
    width: '31%',
    aspectRatio: 0.9,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  tabItem: {
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    color: '#1F2937',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
