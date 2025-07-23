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
import {ArrowLeft, Send} from 'lucide-react-native';
import RenderHTML from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {
  fetchDiscussionById, submitDiscussionReply,
//   submitDiscussionReply,
} from '../../redux/slice/dashboard';

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

  useEffect(() => {
    dispatch(fetchDiscussionById(discussionId));
  }, [discussionId]);

  const getRandomColor = (name: string) => {
    const colors = ['#c147e9', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#10b981'];
    const charCodeSum = name
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

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

  if (isLoading || !discussionDetails) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={color} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {backgroundColor: color}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Discussions</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.detailContainer}>
          <Text style={styles.discussionTitle}>{discussionDetails?.title}</Text>
          <RenderHTML
            contentWidth={width}
            source={{html: discussionDetails.content}}
            tagsStyles={{
              p: {fontSize: 15, color: '#374151', lineHeight: 22},
              strong: {fontWeight: '600'},
            }}
          />
        </View>
        {/* Replies */}
        <View style={styles.replyContainer}>
          <Text style={styles.repliesHeading}>Replies</Text>
          {discussionDetails?.replies?.length === 0 ? (
            <Text style={styles.noReplies}>
              No replies yet. Be the first to reply!
            </Text>
          ) : (
            discussionDetails?.replies?.map((reply: any) => (
              <View key={reply.id} style={styles.replyBlock}>
                <View style={styles.replierDetail}>
                  <View
                    style={[
                      styles.avatarCircle,
                      {backgroundColor: getRandomColor(reply.student_name)},
                    ]}>
                    <Text style={styles.avatarText}>
                      {reply.student_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.replyAuthor}>{reply.student_name}</Text>
                    <Text style={styles.replyTime}>
                      {new Date(reply.created_at).toLocaleString()}
                    </Text>
                  </View>
                </View>
                <RenderHTML
                  contentWidth={width}
                  source={{html: reply.message}}
                  tagsStyles={{
                    p: {fontSize: 14, color: '#374151', lineHeight: 22},
                    strong: {fontWeight: '600'},
                  }}
                  baseStyle={{
                    fontSize: 14,
                    color: '#374151',
                    lineHeight: 22,
                    fontWeight: 400,
                  }}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Reply Input or Button */}
      <View style={styles.footer}>
        {showReplyInput ? (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.replyInput}
              placeholder="Write your reply..."
              value={replyText}
              onChangeText={setReplyText}
              editable={!submitting}
              multiline
            />
            <TouchableOpacity
              onPress={handleSendReply}
              style={[styles.sendButton, {backgroundColor: color}]}
              disabled={submitting}>
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.replyButton, {backgroundColor: color}]}
            onPress={handleReply}>
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        )}
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
  content: {
    paddingBottom: 80, // Space for reply button
  },
  discussionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  detailContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  replyContainer: {
    padding: 20,
  },
  repliesHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#111827',
  },
  noReplies: {
    fontSize: 14,
    color: '#6b7280',
  },
  replyBlock: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  replierDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  replyAuthor: {
    fontWeight: '600',
    color: '#111827',
  },
  replyTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  replyButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  replyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
