import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import BottomNavigation from '../../components/BottomNavigation';
import {ArrowLeft} from 'lucide-react-native';
import {RootStackParamList} from '../../types/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import CourseTabs, {TabItem} from '../../components/Tabs';
import {tabs} from '../../utils/constant';
import {fetchSyllabusBySubject} from '../../redux/slice/dashboard';
import RenderHTML from 'react-native-render-html';

type Props = NativeStackScreenProps<RootStackParamList, 'Syllabus'>;

const Syllabus: React.FC<Props> = ({navigation, route}) => {
  const {course} = route.params;
  const {width} = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const [activeTab, setActiveTab] = useState('Syllabus');
  const {subjectSyllabus} = useSelector(
    (state: RootState) => state.dashboardData,
  );

  const handleTabPress = (tab: TabItem) => {
    setActiveTab(tab.label);
    if (tab.route && tab.route !== 'Syllabus') {
      navigation.navigate(tab.route as any, {course: route.params.course});
    }
  };

  const handleBackPress = (): void => {
    navigation.navigate('CourseDetail', {course});
  };

  useEffect(() => {
    dispatch(fetchSyllabusBySubject(course.id));
  }, [course.id]);

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
            <ScrollView style={styles.scrollContent}>
              <View style={styles.tableContainer}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.cell, styles.headerText, {flex: 2}]}>
                    Chapter
                  </Text>
                  <Text style={[styles.cell, styles.headerText, {flex: 3}]}>
                    Description
                  </Text>
                  <Text style={[styles.lastCell, styles.headerText, {flex: 2}]}>
                    Assessment
                  </Text>
                </View>

                {/* Table Body */}
                {subjectSyllabus.length > 0 ? (
                  subjectSyllabus.map((item: any, index: number) => (
                    <View
                      key={item.id}
                      style={
                        index === subjectSyllabus.length - 1
                          ? styles.lastTableRow
                          : styles.tableRow
                      }>
                      <Text style={[styles.cell, styles.chapter, {flex: 2}]}>
                        {item.chapter_name}
                      </Text>
                      <View style={[styles.cell, {flex: 3}]}>
                        <RenderHTML
                          contentWidth={width}
                          source={{html: `<p>${item.description}</p>`}}
                          baseStyle={styles.description}
                          tagsStyles={{
                            p: {margin: 0, padding: 0, textAlign: 'center'},
                            div: {margin: 0, padding: 0, textAlign: 'center'},
                          }}
                        />
                      </View>
                      <Text
                        style={[styles.lastCell, styles.assessment, {flex: 2}]}>
                        {item.assessment_name}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateText}>
                      No syllabus data available.
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
      <BottomNavigation navigation={navigation} activeTab="Dashboard" />
    </View>
  );
};

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
    fontWeight: '500',
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
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  // Table container to add outer border
  tableContainer: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },

  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  // Remove border from last row
  lastTableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
  },

  cell: {
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Remove border from last cell in each row
  lastCell: {
    paddingHorizontal: 8,
    borderRightWidth: 0,
    justifyContent: 'center',
  },

  headerText: {
    fontWeight: '700',
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },

  chapter: {
    fontWeight: '600',
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
  },

  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    textAlign: 'center',
  },

  assessment: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    textAlign: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#082567',
  },

  emptyStateContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  
});

export default Syllabus;
