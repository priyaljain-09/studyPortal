import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {ArrowLeft, Send, Heart} from 'lucide-react-native';
import RenderHTML from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {
  fetchDiscussionById,
  submitDiscussionReply,
} from '../../redux/slice/dashboard';
import Avatar from '../../components/Avatar';

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

// Helper function to format relative time like YouTube
const formatRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};

type Props = NativeStackScreenProps<RootStackParamList, 'DiscussionDetails'>;

const DiscussionDetails: React.FC<Props> = ({navigation, route}) => {
  const {discussionId, color} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {width} = useWindowDimensions();
  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const {discussionDetails} = useSelector(
    (state: RootState) => state.dashboardData,
  );

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    dispatch(fetchDiscussionById(discussionId));
  }, [discussionId]);

  const handleReply = () => {
    setShowReplyInput(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      Alert.alert('Error', 'Please enter a reply before sending.');
      return;
    }

    try {
      setSubmitting(true);
      await dispatch(submitDiscussionReply(discussionId, {message: replyText}));
      setReplyText('');
      setShowReplyInput(false);
      dispatch(fetchDiscussionById(discussionId)); // Refresh replies
    } catch (error) {
      Alert.alert('Error', 'Failed to send reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeReply = (replyId: string) => {
    const newLikedReplies = new Set(likedReplies);
    if (likedReplies.has(replyId)) {
      newLikedReplies.delete(replyId);
    } else {
      newLikedReplies.add(replyId);
    }
    setLikedReplies(newLikedReplies);    
  };

  if (isLoading || !discussionDetails) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={color} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: color}]}>
      <StatusBar backgroundColor={color} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {backgroundColor: color}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Discussions</Text>
      </View>

      <View style={styles.mainContainer}>
        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={true}>
          <View style={styles.metaInfo}>
            <Avatar label={discussionDetails?.teacher_name || ''} size={60} />
            <View>
              <Text style={styles.authorName}>
                {discussionDetails?.teacher_name}
              </Text>
              <Text style={styles.roleDate}>
                {discussionDetails?.teacher_role?.toUpperCase()} Posted{' '}
                {formatDate(discussionDetails?.created_at)}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailContainer}>
            <Text style={styles.discussionTitle}>
              {discussionDetails?.title}
            </Text>
            <RenderHTML
              contentWidth={width}
              source={{html: discussionDetails.content}}
              tagsStyles={{
                p: {fontSize: 15, color: '#374151', lineHeight: 22},
                strong: {fontWeight: '600'},
              }}
            />
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsCount}>
                {discussionDetails?.replies?.length || 0} Comments
              </Text>
            </View>

            {discussionDetails?.replies?.length === 0 ? (
              <View style={styles.noCommentsContainer}>
                <Text style={styles.noComments}>
                  No comments yet. Be the first to comment!
                </Text>
              </View>
            ) : (
              <View style={styles.commentsList}>
                {discussionDetails?.replies?.map((reply: any) => (
                  <View key={reply.id} style={styles.commentItem}>
                    <Avatar label={reply?.student_name || ''} size={36} />
                    
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor}>
                          {reply.student_name}
                        </Text>
                        <Text style={styles.commentTime}>
                          {formatRelativeTime(reply.created_at)}
                        </Text>
                      </View>
                      
                      <View style={styles.commentText}>
                        <RenderHTML
                          contentWidth={width - 80}
                          source={{html: reply.message}}
                          tagsStyles={{
                            p: {
                              fontSize: 14, 
                              color: '#0f0f0f', 
                              lineHeight: 20,
                              margin: 0,
                              padding: 0,
                            },
                            strong: {fontWeight: '600'},
                          }}
                          baseStyle={{
                            fontSize: 14,
                            color: '#0f0f0f',
                            lineHeight: 20,
                            margin: 0,
                            padding: 0,
                          }}
                        />
                      </View>

                      <View style={styles.commentActions}>
                        <TouchableOpacity 
                          style={styles.likeButton}
                          onPress={() => handleLikeReply(reply.id)}
                        >
                          <Heart 
                            size={16} 
                            color={likedReplies.has(reply.id) ? '#ff0000' : '#606060'}
                            fill={likedReplies.has(reply.id) ? '#ff0000' : 'transparent'}
                          />
                          <Text style={[
                            styles.likeCount,
                            likedReplies.has(reply.id) && styles.likedText
                          ]}>
                            {likedReplies.has(reply.id) ? '1' : ''}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Reply Input or Button */}
        <View style={styles.footer}>
          {showReplyInput ? (
            <View style={styles.inputContainer}>
              <Avatar label="You" size={32} />
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.replyInput}
                  placeholder="Add a comment..."
                  value={replyText}
                  onChangeText={setReplyText}
                  editable={!submitting}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  onPress={handleSendReply}
                  style={[
                    styles.sendButton, 
                    {backgroundColor: replyText.trim() ? color : '#cccccc'}
                  ]}
                  disabled={submitting || !replyText.trim()}>
                  <Send size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.addCommentButton]}
              onPress={handleReply}>
              <Avatar label="You" size={32} />
              <Text style={styles.addCommentText}>Add a comment...</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DiscussionDetails;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingTop: 60,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Space for fixed footer
  },
  discussionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  detailContainer: {
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    paddingBottom: 20,
    marginBottom: 20,
  },
  metaInfo: {
    marginBottom: 16,
    gap: 12,
    alignItems: 'center',
    flexDirection: 'row',
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  
  // Comments Section Styles
  commentsSection: {
    flex: 1,
  },
  commentsHeader: {
    marginBottom: 16,
  },
  commentsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f0f0f',
  },
  noCommentsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noComments: {
    fontSize: 14,
    color: '#606060',
    textAlign: 'center',
  },
  commentsList: {
    gap: 16,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f0f0f',
  },
  commentTime: {
    fontSize: 12,
    color: '#606060',
  },
  commentText: {
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: -8,
  },
  likeCount: {
    fontSize: 12,
    color: '#606060',
    fontWeight: '500',
  },
  likedText: {
    color: '#ff0000',
  },
  
  // Footer Styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addCommentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  addCommentText: {
    fontSize: 14,
    color: '#606060',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#f9fafb',
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});