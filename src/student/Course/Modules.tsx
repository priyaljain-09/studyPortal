import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  FileText,
  BookOpen,
} from 'lucide-react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {fetchModaulesBySubject} from '../../redux/slice/dashboard';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import BottomNavigation from '../../components/BottomNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Modules'>;

const ModulesScreen: React.FC<Props> = ({navigation, route}) => {
  const {course} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {allModules} = useSelector((state: RootState) => state.dashboardData);
  const {isLoading} = useSelector((state: RootState) => state.applicationData);

  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const openFile = (url: string) => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open file URL:', err),
    );
  };

  useEffect(() => {
    dispatch(fetchModaulesBySubject(course.id));
  }, [course.id, dispatch]);

  return (
    <View style={styles.container}>
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

          {allModules?.modules?.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No modules available.</Text>
            </View>
          ) : (
            <FlatList
              data={allModules.modules}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View>
                  <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggleExpand(item.id)}>
                    <Text style={styles.sectionTitle}>
                      {item.name}: {item.description}
                    </Text>
                    {expandedIds.includes(item.id) ? (
                      <ChevronDown size={20} color="#374151" />
                    ) : (
                      <ChevronRight size={20} color="#374151" />
                    )}
                  </TouchableOpacity>

                  {expandedIds.includes(item.id) && (
                    <View>
                      {/* Chapters */}
                      {item.chapters.map((chapter: any, index: number) => (
                        <TouchableOpacity
                          key={chapter.id}
                          style={styles.itemRow}
                          onPress={() =>
                            navigation.navigate('ModuleDetails', {
                              moduleId: chapter.id,
                              courseColor: course.color,
                              courseTitle: course.title,
                              // Add these new parameters
                              currentChapterIndex: index,
                              allChapters: item.chapters,
                              moduleName: item.name,
                            })
                          }>
                          <BookOpen size={18} color="#6B7280" />
                          <Text style={styles.itemText}>{chapter.name}</Text>
                        </TouchableOpacity>
                      ))}
                      {/* Materials */}
                      {item.materials.map((material: any) => (
                        <TouchableOpacity
                          key={material.id}
                          style={styles.itemRow}
                          onPress={() => openFile(material.file)}>
                          <FileText size={18} color="#6B7280" />
                          <Text style={styles.itemText}>{material.title}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
            />
          )}
        </>
      )}
      <BottomNavigation navigation={navigation} activeTab="Dashboard" />
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {flex: 1, backgroundColor: '#fff'},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingLeft: 20,
    gap: 10,
  },
  itemText: {fontSize: 18, color: '#374151'},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});

export default ModulesScreen;
