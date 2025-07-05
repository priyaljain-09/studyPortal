import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
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
  console.log('announcementId', announcementId, announcemntDetail);

  useEffect(() => {
    dispatch(fetchAllAnnouncementById(announcementId));
  }, [announcementId]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={courseColor} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {backgroundColor: courseColor}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{announcemntDetail.subject}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={courseColor} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.metaInfo}>
            <View style={styles.authorProfile}>
              <Text style={styles.profileLogo}>A</Text>
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

          <Text style={styles.message}>
            {announcemntDetail.message?.replace(/\r\n|\n/g, '\n')}
          </Text>

          <Text style={styles.footerNote}>
            This topic is closed for comments.
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AnnouncementDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80,
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
  footerNote: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
