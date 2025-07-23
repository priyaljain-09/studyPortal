import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import {RootStackParamList} from '../../types/types';
import ModuleBanner from '../../components/Banner';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchChapterById} from '../../redux/slice/dashboard';
import RenderHTML from 'react-native-render-html';
import {ArrowLeft} from 'lucide-react-native';
import BottomNavigation from '../../components/BottomNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ModuleDetails'>;

const ModuleDetails: React.FC<Props> = ({navigation, route}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    moduleId,
    courseColor,
    courseTitle,
    currentChapterIndex,
    allChapters,
    moduleName,
  } = route.params;

  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const {chapterDetail} = useSelector(
    (state: RootState) => state.dashboardData,
  );

  const {width} = useWindowDimensions();

  // Navigation functions
  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      const previousChapter = allChapters[currentChapterIndex - 1];
      navigation.replace('ModuleDetails', {
        moduleId: previousChapter.id,
        courseColor,
        courseTitle,
        currentChapterIndex: currentChapterIndex - 1,
        allChapters,
        moduleName,
      });
    }
  };

  const goToNextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      navigation.replace('ModuleDetails', {
        moduleId: nextChapter.id,
        courseColor,
        courseTitle,
        currentChapterIndex: currentChapterIndex + 1,
        allChapters,
        moduleName,
      });
    }
  };

  const canGoToPrevious = currentChapterIndex > 0;
  const canGoToNext = currentChapterIndex < allChapters.length - 1;

  useEffect(() => {
    dispatch(fetchChapterById(moduleId));
  }, [moduleId]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={courseColor} barStyle="light-content" />
      <View style={[styles.header, {backgroundColor: courseColor}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modules</Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={courseColor} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.chapterContainer}>
          {/* <ModuleBanner moduleTitle={chapterDetail.name} /> */}
          <Text style={styles.chapterName}>{chapterDetail.name}</Text>

          {/* Content */}
          <RenderHTML
            contentWidth={width}
            source={
              chapterDetail?.description
                ? {html: chapterDetail.description}
                : {html: '<p>No chapter content available.</p>'}
            }
            tagsStyles={{
              p: {
                fontSize: 16,
                color: '#444',
                marginBottom: 8,
                lineHeight: 22,
              },
              strong: {fontWeight: '700'},
              li: {
                marginBottom: 4,
                fontSize: 16,
                color: '#444',
                lineHeight: 22,
              },
              ul: {marginBottom: 8, paddingLeft: 20},
              br: {marginBottom: 4},
            }}
            systemFonts={[]}
            ignoredDomTags={[]}
            ignoredStyles={[]}
            enableExperimentalMarginCollapsing={false}
            enableExperimentalBRCollapsing={false}
            enableExperimentalGhostLinesPrevention={false}
          />
        </ScrollView>
      )}

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={goToPreviousChapter}
          style={[styles.navButton, !canGoToPrevious && styles.disabledButton]}
          disabled={!canGoToPrevious}>
          <Text
            style={[styles.navText, !canGoToPrevious && styles.disabledText]}>
            ◀ Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNextChapter}
          style={[styles.navButton, !canGoToNext && styles.disabledButton]}
          disabled={!canGoToNext}>
          <Text style={[styles.navText, !canGoToNext && styles.disabledText]}>
            Next ▶
          </Text>
        </TouchableOpacity>
      </View>
      {/* <BottomNavigation navigation={navigation} activeTab="Dashboard" /> */}
    </SafeAreaView>
  );
};

export default ModuleDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  chapterName: {
    fontSize: 20,
    fontWeight: 600,
    color: "black",
  },
  chapterContainer: {
    padding: 20,
  },
  banner: {
    width: '100%',
    height: 160,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
  },
  weekText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bulletList: {
    paddingLeft: 10,
  },
  bulletItem: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  navButton: {
    padding: 10,
    minWidth: 80,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledText: {
    color: '#999',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
