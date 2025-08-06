import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
  TextInput,
  Animated,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  Mail,
  Phone,
  MessageCircle,
  Users,
  GraduationCap,
  UserCheck,
  Filter,
  X,
} from 'lucide-react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import BottomNavigation from '../../components/BottomNavigation';
import CourseTabs, {TabItem} from '../../components/Tabs';
import {tabs} from '../../utils/constant';
import Avatar from '../../components/Avatar';

interface Person {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'teacher' | 'student' | 'assistant';
  avatar?: string;
  department?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'People'>;

const People: React.FC<Props> = ({navigation, route}) => {
  const {course} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.applicationData);
  const [activeTab, setActiveTab] = useState('People');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Animation values
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);

  // Mock data - replace with your actual data structure
  const mockPeople: Person[] = [
    {
      id: 1,
      name: 'Ethan Brown',
      email: 'ethan.brown@university.edu',
      phone: '+1 (555) 123-4567',
      role: 'student',
      department: 'Computer Science',
      status: 'online',
    },
    {
      id: 2,
      name: 'Amelia Wilson',
      email: 'amelia.wilson@university.edu',
      role: 'teacher',
      department: 'Mathematics',
      status: 'online',
    },
    {
      id: 3,
      name: 'David Lee',
      email: 'david.lee@university.edu',
      role: 'student',
      department: 'Computer Science',
      status: 'away',
      lastSeen: '2 hours ago',
    },
    {
      id: 4,
      name: 'Sophia Martinez',
      email: 'sophia.martinez@university.edu',
      role: 'assistant',
      department: 'Computer Science',
      status: 'offline',
      lastSeen: '1 day ago',
    },
    {
      id: 5,
      name: 'James Anderson',
      email: 'james.anderson@university.edu',
      role: 'student',
      department: 'Computer Science',
      status: 'online',
    },
    {
      id: 6,
      name: 'Isabella Hall',
      email: 'isabella.hall@university.edu',
      role: 'student',
      department: 'Computer Science',
      status: 'offline',
      lastSeen: '3 hours ago',
    },
    {
      id: 7,
      name: 'Michael Green',
      email: 'michael.green@university.edu',
      role: 'teacher',
      department: 'Computer Science',
      status: 'online',
    },
    {
      id: 8,
      name: 'Emma Carter',
      email: 'emma.carter@university.edu',
      role: 'student',
      department: 'Computer Science',
      status: 'away',
      lastSeen: '30 minutes ago',
    },
  ];

  const handleTabPress = (tab: TabItem) => {
    setActiveTab(tab.label);
    if (tab.route && tab.route !== 'People') {
      navigation.navigate(tab.route as any, {course: route.params.course});
    }
  };

  const handleBackPress = (): void => {
    if (isSearchExpanded) {
      handleSearchClose();
    } else {
      navigation.navigate('CourseDetail', {course});
    }
  };

  const handleSearchPress = () => {
    setIsSearchExpanded(true);
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      searchInputRef.current?.focus();
    });
  };

  const handleSearchClose = () => {
    setSearchQuery('');
    setIsSearchExpanded(false);
    Animated.timing(searchAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#10B981';
      case 'away':
        return '#F59E0B';
      case 'offline':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher':
        return <GraduationCap size={14} color="#8B5CF6" />;
      case 'assistant':
        return <UserCheck size={14} color="#06B6D4" />;
      default:
        return <Users size={14} color="#6B7280" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'teacher':
        return '#8B5CF6';
      case 'assistant':
        return '#06B6D4';
      default:
        return '#6B7280';
    }
  };

  const filterPeople = () => {
    let filtered = mockPeople; // Replace with peopleList from Redux

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        person =>
          person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.department?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by role
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(person => person.role === selectedFilter);
    }

    setFilteredPeople(filtered);
  };

  useEffect(() => {
    filterPeople();
  }, [searchQuery, selectedFilter]);

  const handleContactPerson = (
    person: Person,
    type: 'email' | 'phone' | 'message',
  ) => {
    // Implement contact functionality
    console.log(`Contact ${person.name} via ${type}`);
  };

  //   const renderPersonItem: ListRenderItem<Person> = ({item}) => {
  //     return (
  //       <TouchableOpacity
  //         style={styles.personCard}
  //         activeOpacity={0.7}
  //         onPress={() => {
  //           console.log('View profile:', item.name);
  //         }}>
  //         <View style={styles.personContent}>
  //           <View style={styles.avatarContainer}>
  //             {item.avatar ? (
  //               <Image source={{uri: item.avatar}} style={styles.avatar} />
  //             ) : (
  //               <Avatar label={item.name} size={50} />
  //             )}
  //             <View
  //               style={[
  //                 styles.statusIndicator,
  //                 {backgroundColor: getStatusColor(item.status)},
  //               ]}
  //             />
  //           </View>

  //           <View style={styles.personInfo}>
  //             <View style={styles.personNameRow}>
  //               <Text style={styles.personName} numberOfLines={1}>
  //                 {item.name}
  //               </Text>
  //               <View
  //                 style={[
  //                   styles.roleBadge,
  //                   {backgroundColor: `${getRoleBadgeColor(item.role)}15`},
  //                 ]}>
  //                 {getRoleIcon(item.role)}
  //                 <Text
  //                   style={[
  //                     styles.roleText,
  //                     {color: getRoleBadgeColor(item.role)},
  //                   ]}>
  //                   {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
  //                 </Text>
  //               </View>
  //             </View>

  //             <Text style={styles.personEmail} numberOfLines={1}>
  //               {item.email}
  //             </Text>
  //             {item.department && (
  //               <Text style={styles.personDepartment} numberOfLines={1}>
  //                 {item.department}
  //               </Text>
  //             )}

  //             <View style={styles.statusRow}>
  //               <View style={styles.statusInfo}>
  //                 <View
  //                   style={[
  //                     styles.statusDot,
  //                     {backgroundColor: getStatusColor(item.status)},
  //                   ]}
  //                 />
  //                 <Text style={styles.statusText}>
  //                   {item.status === 'online'
  //                     ? 'Online'
  //                     : item.status === 'away'
  //                     ? 'Away'
  //                     : item.lastSeen
  //                     ? `Last seen ${item.lastSeen}`
  //                     : 'Offline'}
  //                 </Text>
  //               </View>
  //             </View>
  //           </View>

  //           <View style={styles.contactActions}>
  //             <TouchableOpacity
  //               style={[styles.contactButton, styles.emailButton]}
  //               onPress={() => handleContactPerson(item, 'email')}>
  //               <Mail size={16} color="#3B82F6" />
  //             </TouchableOpacity>

  //             {item.phone && (
  //               <TouchableOpacity
  //                 style={[styles.contactButton, styles.phoneButton]}
  //                 onPress={() => handleContactPerson(item, 'phone')}>
  //                 <Phone size={16} color="#10B981" />
  //               </TouchableOpacity>
  //             )}

  //             <TouchableOpacity
  //               style={[styles.contactButton, styles.messageButton]}
  //               onPress={() => handleContactPerson(item, 'message')}>
  //               <MessageCircle size={16} color="#8B5CF6" />
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //     );
  //   };

  const renderFilterButton = (
    filter: string,
    label: string,
    icon: React.ReactNode,
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilterButton,
        selectedFilter === filter && {
          backgroundColor: `${course.color}20`,
          borderColor: course.color,
        },
      ]}
      onPress={() => setSelectedFilter(filter)}>
      {icon}
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.activeFilterButtonText,
          selectedFilter === filter && {color: course.color},
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const getStats = () => {
    const teachers = filteredPeople.filter(p => p.role === 'teacher').length;
    const students = filteredPeople.filter(p => p.role === 'student').length;
    const assistants = filteredPeople.filter(
      p => p.role === 'assistant',
    ).length;
    const online = filteredPeople.filter(p => p.status === 'online').length;

    return {teachers, students, assistants, online};
  };

  const stats = getStats();

  return (
    <View style={[styles.container, {backgroundColor: course.color}]}>
      <StatusBar backgroundColor={course.color} barStyle="light-content" />

      <View style={[styles.header, {backgroundColor: course.color}]}>
        <View style={styles.topbar}>
          {/* Left Arrow */}
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>

          {/* Right Side: Search Icon or Search Input */}
          {!isSearchExpanded ? (
            <TouchableOpacity
              style={styles.searchIconWrapper}
              onPress={handleSearchPress}>
              <Search size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <Animated.View
              style={[
                styles.searchInputAnimated,
                {
                  width: searchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 220],
                  }),
                  opacity: searchAnimation,
                },
              ]}>
              <View style={styles.searchInputContainer}>
                <Search size={18} color="rgba(255, 255, 255, 0.7)" />
                <TextInput
                  ref={searchInputRef}
                  style={styles.searchInput}
                  placeholder="Search people..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                />
                <TouchableOpacity onPress={handleSearchClose}>
                  <X size={18} color="rgba(255, 255, 255, 0.7)" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{course.title}</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
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
          <ScrollView
            style={styles.contentWrapper}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <GraduationCap size={24} color="#8B5CF6" />
                <Text style={styles.statNumber}>{stats.teachers}</Text>
                <Text style={styles.statLabel}>Teachers</Text>
              </View>
              <View style={styles.statCard}>
                <Users size={24} color="#6B7280" />
                <Text style={styles.statNumber}>{stats.students}</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
              {/* <View style={styles.statCard}>
                <UserCheck size={24} color="#06B6D4" />
                <Text style={styles.statNumber}>{stats.assistants}</Text>
                <Text style={styles.statLabel}>Assistants</Text>
              </View> */}
              <View style={styles.statCard}>
                <View
                  style={[styles.onlineIndicator, {backgroundColor: '#10B981'}]}
                />
                <Text style={styles.statNumber}>{stats.online}</Text>
                <Text style={styles.statLabel}>Online</Text>
              </View>
            </View>

            {/* Filter Buttons */}
            <View style={styles.filtersContainer}>
              <Text style={styles.filtersTitle}>Filter by role:</Text>
              <View style={styles.filtersRow}>
                {renderFilterButton(
                  'all',
                  'All',
                  <Users
                    size={14}
                    color={selectedFilter === 'all' ? course.color : '#6B7280'}
                  />,
                )}
                {renderFilterButton(
                  'teacher',
                  'Teachers',
                  <GraduationCap
                    size={14}
                    color={
                      selectedFilter === 'teacher' ? course.color : '#8B5CF6'
                    }
                  />,
                )}
                {renderFilterButton(
                  'student',
                  'Students',
                  <Users
                    size={14}
                    color={
                      selectedFilter === 'student' ? course.color : '#6B7280'
                    }
                  />,
                )}
              </View>
            </View>

            {/* People List */}
            {filteredPeople.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Users size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No People Found</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery
                    ? 'Try adjusting your search criteria'
                    : 'No people available in this course'}
                </Text>
              </View>
            ) : (
              filteredPeople.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.personCard}
                  activeOpacity={0.7}
                  onPress={() => {
                    console.log('View profile:', item.name);
                  }}>
                  <View style={styles.personContent}>
                    <View style={styles.avatarContainer}>
                      {item.avatar ? (
                        <Image
                          source={{uri: item.avatar}}
                          style={styles.avatar}
                        />
                      ) : (
                        <Avatar label={item.name} size={50} />
                      )}
                      <View
                        style={[
                          styles.statusIndicator,
                          {backgroundColor: getStatusColor(item.status)},
                        ]}
                      />
                    </View>

                    <View style={styles.personInfo}>
                      <View style={styles.personNameRow}>
                        <Text style={styles.personName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <View
                          style={[
                            styles.roleBadge,
                            {
                              backgroundColor: `${getRoleBadgeColor(
                                item.role,
                              )}15`,
                            },
                          ]}>
                          {getRoleIcon(item.role)}
                          <Text
                            style={[
                              styles.roleText,
                              {color: getRoleBadgeColor(item.role)},
                            ]}>
                            {item.role.charAt(0).toUpperCase() +
                              item.role.slice(1)}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.personEmail} numberOfLines={1}>
                        {item.email}
                      </Text>
                      {item.department && (
                        <Text style={styles.personDepartment} numberOfLines={1}>
                          {item.department}
                        </Text>
                      )}

                      <View style={styles.statusRow}>
                        <View style={styles.statusInfo}>
                          <View
                            style={[
                              styles.statusDot,
                              {backgroundColor: getStatusColor(item.status)},
                            ]}
                          />
                          <Text style={styles.statusText}>
                            {item.status === 'online'
                              ? 'Online'
                              : item.status === 'away'
                              ? 'Away'
                              : item.lastSeen
                              ? `Last seen ${item.lastSeen}`
                              : 'Offline'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.contactActions}>
                      <TouchableOpacity
                        style={[styles.contactButton, styles.emailButton]}
                        onPress={() => handleContactPerson(item, 'email')}>
                        <Mail size={16} color="#3B82F6" />
                      </TouchableOpacity>

                      {item.phone && (
                        <TouchableOpacity
                          style={[styles.contactButton, styles.phoneButton]}
                          onPress={() => handleContactPerson(item, 'phone')}>
                          <Phone size={16} color="#10B981" />
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={[styles.contactButton, styles.messageButton]}
                        onPress={() => handleContactPerson(item, 'message')}>
                        <MessageCircle size={16} color="#8B5CF6" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
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
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    padding: 8,
  },
  searchButton: {
    padding: 8,
    backgroundColor: 'pink',
  },
  searchContainer: {
    overflow: 'hidden',
    width: '80%',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    paddingVertical: 0,
  },
  closeButton: {
    padding: 4,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  onlineIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  activeFilterButton: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  personCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  personContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  personInfo: {
    flex: 1,
    marginRight: 12,
  },
  personNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  personName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  personEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  personDepartment: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  contactActions: {
    alignItems: 'center',
    gap: 8,
  },
  contactButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emailButton: {
    backgroundColor: '#EBF4FF',
  },
  phoneButton: {
    backgroundColor: '#ECFDF5',
  },
  messageButton: {
    backgroundColor: '#F3E8FF',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    minHeight: 200,
  },
  searchIconWrapper: {
    padding: 8,
  },

  searchInputAnimated: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default People;
