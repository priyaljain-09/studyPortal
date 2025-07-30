// AssignmentGradeDetail.tsx

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import {RootStackParamList} from '../../types/types';
import {ArrowLeft} from 'lucide-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {Circle, Svg, Path} from 'react-native-svg';
import {fetchGradesById} from '../../redux/slice/dashboard';
import RenderHTML from 'react-native-render-html';
import Avatar from '../../components/Avatar';

const {width} = Dimensions.get('window');
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  

type Props = NativeStackScreenProps<RootStackParamList, 'GradeDetail'>;

const GradeDetail: React.FC<Props> = ({navigation, route}) => {
  const {gradeId, courseColor} = route.params || {};
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const {gradesDetail} = useSelector((state: RootState) => state.dashboardData);
  const marks = gradesDetail.marks_obtained ?? '--';
  const total = gradesDetail.assignment_totalmarks;
  const {width: contentWidth} = useWindowDimensions();

  const topic = ['Trigonometry', 'Algorothm', 'Test'];

  const formatTopics = (topics: string[]) => {
    if (!topics || topics.length === 0) return '';
    if (topics.length === 1) return `the topic ${topics[0]}`;
    const last = topics[topics.length - 1];
    const rest = topics.slice(0, -1).join(', ');
    return `the topics ${rest} and ${last}`;
  };


  const getColorWithOpacity = (color: string, opacity: number) => {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  };


  useEffect(() => {
    dispatch(fetchGradesById(gradeId));
  }, [gradeId]);

  const progressPercentage = gradesDetail.marks_obtained
    ? gradesDetail.marks_obtained / total
    : 0;
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - progressPercentage * circumference;

  return (
    <SafeAreaView style={styles.container}>
<StatusBar backgroundColor={courseColor} barStyle="dark-content" />

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={courseColor} />
        </View>
      ) : (
        <View style={styles.mainWrapper}>
          {/* Blue Header Section */}
          <View style={[styles.headerSection, { backgroundColor: courseColor }]}>
            {/* Header with back button and title */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Assignment Grade</Text>
              <View style={{width: 24}} />
            </View>
          </View>

          {/* Curved Shape with SVG */}
          <View style={styles.curveContainer}>
            <Svg height="120" width={width} style={styles.svgCurve}>
              <Path
                d={`M0,0 L${width},0 L${width},40 Q${width / 2},120 0,40 Z`}
                fill={courseColor}
                />
            </Svg>

            {/* Circular Progress positioned on the curve */}
            <View style={styles.circleWrapper}>
              <View style={styles.circleProgressContainer}>
                <Svg width={160} height={160} viewBox="0 0 100 100">
                  {/* Background circle */}
                  <Circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="white"
                    strokeWidth="6"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <Circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke={getColorWithOpacity(courseColor, 0.4)}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    rotation="-90"
                    origin="50,50"
                  />
                </Svg>
                <View style={styles.scoreOverlay}>
                  <Text style={styles.score}>{marks}</Text>
                  <Text style={styles.total}>/{total}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* White content section */}
          <ScrollView
            style={styles.contentSection}
            contentContainerStyle={styles.contentContainer}>
            {/* Assignment Info */}
            <View style={styles.assignmentInfo}>
              <Text style={styles.assignmentTitle}>
                {gradesDetail.assignment_title}
              </Text>
              <Text style={styles.description}>
                {`This assignment covers ${formatTopics(
                  topic,
                )} of the textbook. Please ensure all work is shown for full credit.`}
              </Text>
            </View>

            {/* Feedback Section */}
            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackHeading}>Feedback</Text>
              <View style={styles.feedbackBox}>
                {gradesDetail?.teacher_name && <Avatar label={gradesDetail?.teacher_name} />}
                <View style={styles.feedbackTextWrapper}>
                  <View style={styles.feedbackHeader}>
                    <Text style={styles.teacherName}>
                      Professor {gradesDetail.teacher_name}
                    </Text>
                    {/* <Text style={styles.date}>2d</Text> */}
                  </View>
                  <RenderHTML
                    contentWidth={contentWidth}
                    source={{
                      html:
                        gradesDetail?.feedback ||
                        '<p>No feedback available</p>',
                    }}
                    baseStyle={{fontSize: 15, lineHeight: 22, color: "black"}}
                    tagsStyles={{
                      p: {color: 'black'},
                      span: {color: 'black'},
                      div: {color: 'black'},
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default GradeDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainWrapper: {
    flex: 1,
  },
  headerSection: {
    // backgroundColor: '#93D4FF',
    paddingTop: 20,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  curveContainer: {
    position: 'relative',
    height: 130,
    backgroundColor: '#fff',
  },
  svgCurve: {
    position: 'absolute',
    top: 0,
  },
  circleWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  circleProgressContainer: {
    position: 'relative',
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  scoreOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 40,
    padding: 10,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 52,
  },
  total: {
    fontSize: 20,
    color: '#555',
    marginTop: -5,
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  assignmentInfo: {
    marginBottom: 30,
  },
  assignmentTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  feedbackSection: {
    flex: 1,
  },
  feedbackHeading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#000',
  },
  feedbackBox: {
    flexDirection: 'row',
    gap: 20,
    borderRadius: 12,
    padding: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  feedbackTextWrapper: {
    flex: 1,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  date: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  homeIcon: {
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  assignmentsIcon: {
    backgroundColor: '#666',
    borderRadius: 2,
  },
  calendarIcon: {
    backgroundColor: '#666',
    borderRadius: 2,
  },
  profileIcon: {
    backgroundColor: '#666',
    borderRadius: 12,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});
