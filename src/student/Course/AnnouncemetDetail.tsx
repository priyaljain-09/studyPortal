import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';
import {ArrowLeft, SendHorizonal} from 'lucide-react-native';
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

  const [comments, setComments] = useState([
    {id: '1', user: 'Priyal', text: 'Thanks for the update!'},
    {id: '2', user: 'Test', text: 'Noted. Will submit on time.'},
  ]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    dispatch(fetchAllAnnouncementById(announcementId));
  }, [announcementId]);

  const handlePostComment = () => {
    if (newComment.trim() === '') return;

    const comment = {
      id: Date.now().toString(),
      user: 'You',
      text: newComment.trim(),
    };
    setComments([comment, ...comments]);
    setNewComment('');
    // TODO: Post comment to API
  };

  const renderComment = ({item}: any) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentUser}>{item.user}:</Text>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={courseColor} barStyle="light-content" />
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
        <>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={renderComment}
            ListHeaderComponent={
              <View style={styles.contentContainer}>
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
                <Text style={styles.commentHeader}>Comments</Text>
              </View>
            }
            contentContainerStyle={styles.flatListContainer}
            ListFooterComponent={<View style={{height: 100}} />}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.commentInputContainer}>
            <TextInput
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              style={styles.commentInput}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              onPress={handlePostComment}
              style={styles.sendBtn}>
              <SendHorizonal size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
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
    gap: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
    backgroundColor: '#fafafa',
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 15,
    color: '#333',
  },
  sendBtn: {
    backgroundColor: '#0a66c2',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
