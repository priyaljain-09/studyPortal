import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {ArrowLeft} from 'lucide-react-native';
import {Megaphone} from 'lucide-react-native'; // bullhorn icon
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchAllAnnouncementBySubject} from '../../redux/slice/dashboard';
import BottomNavigation from '../../components/BottomNavigation';
import CourseTabs, { TabItem } from '../../components/Tabs';
import { tabs } from '../../utils/constant';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseAnnouncements'>;

const CourseAnnouncements: React.FC<Props> = ({navigation, route}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {course} = route.params;
  const [activeTab, setActiveTab] = useState('Announcements');
  const {allAnnouncements} = useSelector(
    (state: RootState) => state.dashboardData,
  );
  const {isLoading} = useSelector((state: RootState) => state.applicationData);

  const handleBackPress = () => {
    navigation.navigate('CourseDetail', {course});
  };

  const handleTabPress = (tab: TabItem) => {
    setActiveTab(tab.label);
    if (tab.route && tab.route !== 'Announcements') {
      navigation.navigate(tab.route as any, {course: route.params.course});
    }
  };


  useEffect(() => {
    dispatch(fetchAllAnnouncementBySubject(course.id));
  }, []);

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const formatted = new Intl.DateTimeFormat('en-GB', options).format(date);

    return formatted.replace(',', ' at');
  };

  return (
    <View style={[styles.container, {backgroundColor: course.color}]}>
      <StatusBar backgroundColor={course.color} barStyle="light-content" />
      <View style={[styles.header, {backgroundColor: course.color}]}>
        <TouchableOpacity style={styles.headerTop} onPress={handleBackPress}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Announcements</Text>
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
        <>
          <FlatList
            data={allAnnouncements?.announcements}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.announcementItem}
                onPress={() =>
                  navigation.navigate('AnnouncementDetails', {
                    announcementId: item.id,
                    courseColor: course.color,
                    courseTitle: course.title,
                  })
                }>
                <View style={styles.iconContainer}>
                  <Megaphone size={18} color="#bf1650" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.announcementTitle}>{item.title}</Text>
                  <Text style={styles.announcementDate}>
                    Last post: {formatDate(item.created_at)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}
      </View>
      </View>
      <BottomNavigation navigation={navigation} activeTab="Dashboard" />
    </View>
  );
};

export default CourseAnnouncements;

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
    fontSize: 24,
    lineHeight: 36,
    fontWeight: 'bold',
  },
  container: {flex: 1, backgroundColor: '#fff'},
  mainContent: {
    flex: 1,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  announcementItem: {
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
  announcementTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
    marginBottom: 4,
  },
  announcementDate: {
    fontSize: 13,
    color: '#666',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
