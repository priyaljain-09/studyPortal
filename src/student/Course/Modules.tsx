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
  ListRenderItem,
} from 'react-native';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  FileText,
  BookOpen,
  Triangle,
} from 'lucide-react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {fetchModaulesBySubject} from '../../redux/slice/dashboard';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import BottomNavigation from '../../components/BottomNavigation';
import CourseTabs, {TabItem} from '../../components/Tabs';
import {tabs} from '../../utils/constant';

interface Chapter {
  id: number;
  name: string;
}

interface Material {
  id: number;
  title: string;
  file: string;
}

interface Module {
  id: number;
  name: string;
  description: string;
  chapters: Chapter[];
  materials: Material[];
}

type Props = NativeStackScreenProps<RootStackParamList, 'Modules'>;

const ModulesScreen: React.FC<Props> = ({navigation, route}) => {
  const {course} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {allModules} = useSelector((state: RootState) => state.dashboardData);
  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const [activeTab, setActiveTab] = useState('Modules');
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const handleTabPress = (tab: TabItem) => {
    setActiveTab(tab.label);
    if (tab.route && tab.route !== 'Modules') {
      navigation.navigate(tab.route as any, {course: route.params.course});
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const openFile = (url: string): void => {
    Linking.openURL(url).catch((err: any) =>
      console.error('Failed to open file URL:', err),
    );
  };

  const handleBackPress = (): void => {
    navigation.navigate('CourseDetail', {course});
  };

  useEffect(() => {
    dispatch(fetchModaulesBySubject(course.id));
  }, [course.id, dispatch]);

  // Enhanced render function for better dropdown effect
  const renderModuleItem: ListRenderItem<Module> = ({item, index}) => {
    const isExpanded = expandedIds.includes(item.id);
    const hasContent = item.chapters.length > 0 || item.materials.length > 0;

    return (
      <View key={item.id}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>
            {item.name}: {item.description}
          </Text>
          <View style={styles.chevronIcon}>
            {isExpanded ? (
              <ChevronDown size={20} color="#6B7280" />
            ) : (
              <ChevronRight size={20} color="#6B7280" />
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && hasContent && (
          <View style={styles.dropdownContent}>
            {/* Chapters */}
            {item.chapters.map((chapter: Chapter, chapterIndex: number) => (
              <TouchableOpacity
                key={`chapter-${chapter.id}`}
                style={[
                  styles.itemRow,
                  styles.chapterItem,
                  chapterIndex === item.chapters.length - 1 &&
                    item.materials.length === 0 &&
                    styles.lastItemRow,
                ]}
                onPress={() =>
                  navigation.navigate('ModuleDetails', {
                    moduleId: chapter.id,
                    courseColor: course.color,
                    courseTitle: course.title,
                    currentChapterIndex: chapterIndex,
                    allChapters: item.chapters,
                    moduleName: item.name,
                  })
                }
                activeOpacity={0.6}>
                <View style={styles.itemIcon}>
                  <BookOpen size={18} color="#3B82F6" />
                </View>
                <Text style={[styles.itemText, styles.chapterText]}>
                  {chapter.name}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Materials */}
            {item.materials.map((material: Material, materialIndex: number) => (
              <TouchableOpacity
                key={`material-${material.id}`}
                style={[
                  styles.itemRow,
                  styles.materialItem,
                  materialIndex === item.materials.length - 1 &&
                    styles.lastItemRow,
                ]}
                onPress={() => openFile(material.file)}
                activeOpacity={0.6}>
                <View style={styles.itemIcon}>
                  <FileText size={18} color="#10B981" />
                </View>
                <Text style={[styles.itemText, styles.materialText]}>
                  {material.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
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
            <>
              {allModules?.modules?.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No modules available.</Text>
                </View>
              ) : (
                <FlatList
                  data={allModules?.modules || []}
                  keyExtractor={(item: Module) => item.id.toString()}
                  renderItem={renderModuleItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom: 20}}
                />
              )}
            </>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 10,
  },
  chevronIcon: {
    padding: 4,
  },
  dropdownContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: -4,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 3,
    overflow: 'hidden',
  },
  // Enhanced item row styling
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  // Last item should not have bottom border
  lastItemRow: {
    borderBottomWidth: 0,
  },
  itemIcon: {
    marginRight: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    fontWeight: 500,
  },
  // Chapter specific styling
  chapterItem: {
    backgroundColor: '#FAFBFC',
  },
  chapterText: {
    color: '#1F2937',
  },
  // Material specific styling
  materialItem: {
    backgroundColor: '#FFFFFF',
  },
  materialText: {
    color: '#4B5563',
  },
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
