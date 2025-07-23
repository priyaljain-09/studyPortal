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
import RenderHTML from 'react-native-render-html';
import {ArrowLeft, MessageCircle} from 'lucide-react-native';
import {fetchDiscussionBySubject} from '../../redux/slice/dashboard';
import BottomNavigation from '../../components/BottomNavigation';
import CourseTabs, {TabItem} from '../../components/Tabs';
import {tabs} from '../../utils/constant';

type Props = NativeStackScreenProps<RootStackParamList, 'DiscussionList'>;

const DiscussionList: React.FC<Props> = ({navigation, route}) => {
  const {course} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('Discussions');
  const {allDiscussion} = useSelector(
    (state: RootState) => state.dashboardData,
  );
  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const {width} = useWindowDimensions();

  const handleBackPress = () => {
    navigation.navigate('CourseDetail', {course});
  };

  const handleTabPress = (tab: TabItem) => {
    setActiveTab(tab.label);
    if (tab.route && tab.route !== 'Discussions') {
      navigation.navigate(tab.route as any, {course: route.params.course});
    }
  };

  useEffect(() => {
    dispatch(fetchDiscussionBySubject(course.id));
  }, [course.id]);

  const renderDiscussionItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate('DiscussionDetails', {
          discussionId: item.id,
          color: course.color,
        })
      }>
      <View style={styles.iconContainer}>
        <MessageCircle size={20} color="#4f46e5" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.metaText}>
          {item.replies.length} Replies •{' '}
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: course.color}]}>
      <StatusBar backgroundColor={course.color} barStyle="light-content" />
      <View style={[styles.header, {backgroundColor: course.color}]}>
        <TouchableOpacity style={styles.headerTop} onPress={handleBackPress}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Discussions</Text>
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
              data={allDiscussion}
              renderItem={renderDiscussionItem}
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

export default DiscussionList;

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
  container: {
    flex: 1, 
    backgroundColor: '#fff'
  },
  mainContent: {
    flex: 1,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  iconContainer: {
    marginTop: 3,
    marginRight: 12,
  },
  textContainer: {flex: 1},
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
