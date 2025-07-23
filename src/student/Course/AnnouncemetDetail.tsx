import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {ArrowLeft} from 'lucide-react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchAllAnnouncementById} from '../../redux/slice/dashboard';

type Props = NativeStackScreenProps<RootStackParamList, 'AnnouncementDetails'>;

const formatDate = (isoDate: string | undefined): string => {
  if (!isoDate) return 'Invalid date';

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Invalid date';

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-GB', options)
    .format(date)
    .replace(',', ' at');
};

const AnnouncementDetails: React.FC<Props> = ({navigation, route}) => {
  const {announcementId, courseColor, courseTitle} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.applicationData);

  const {announcemntDetail} = useSelector(
    (state: RootState) => state.dashboardData,
  );
  const {width} = useWindowDimensions();

  useEffect(() => {
    dispatch(fetchAllAnnouncementById(announcementId));
  }, [announcementId]);

  const getRandomLightColor = (): string => {
    const hue = Math.floor(Math.random() * 360);
    const pastel = `hsl(${hue}, 60%, 60%)`;
    return pastel;
  };

  const [profileColor, setProfileColor] = useState(getRandomLightColor());

  useEffect(() => {
    setProfileColor(getRandomLightColor());
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={courseColor} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {backgroundColor: courseColor}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Announcements</Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={courseColor} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <View style={styles.metaInfo}>
            <View style={[styles.authorProfile, {backgroundColor: profileColor}]}>
                <Text style={styles.profileLogo}>
                  {announcemntDetail?.teacher_name?.charAt(0)?.toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.authorName}>
                  {announcemntDetail?.teacher_name}
                </Text>
                <Text style={styles.roleDate}>
                  {announcemntDetail?.teacher_role?.toUpperCase()} | Posted{' '}
                  {formatDate(announcemntDetail?.created_at)}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{announcemntDetail.title}</Text>

            <RenderHtml
              contentWidth={width}
              source={
                announcemntDetail?.message
                  ? {html: announcemntDetail.message}
                  : {html: '<p>No announcement content available.</p>'}
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
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AnnouncementDetails;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingTop: 60,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  flatListContainer: {
    paddingBottom: 100,
  },
  metaInfo: {
    marginBottom: 10,
    gap: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  authorProfile: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'grey',
  },
  profileLogo: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  authorName: {
    fontSize: 16,
    color: '#0a66c2',
    fontWeight: '600',
  },
  roleDate: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    marginTop: 16,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 24,
  },
  commentHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  commentItem: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  commentUser: {
    fontWeight: '600',
    color: '#0a66c2',
    marginRight: 6,
  },
  commentText: {
    color: '#444',
    flexShrink: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
