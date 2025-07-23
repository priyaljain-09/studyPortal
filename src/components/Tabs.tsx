import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export interface TabItem {
  label: string;
  route?: string; // Optional: if you want to navigate
}

interface CourseTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tab: TabItem) => void;
}

const CourseTabs: React.FC<CourseTabsProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never">
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.label}
            style={styles.tab}
            onPress={() => onTabPress(tab)}
            activeOpacity={0.7}
            delayPressIn={100}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab.label && styles.activeTabText,
              ]}>
              {tab.label}
            </Text>
            {activeTab === tab.label && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#111827',
    fontWeight: '600',
  },
  activeIndicator: {
    marginTop: 6,
    height: 2,
    backgroundColor: '#3B82F6',
    width: '100%',
    borderRadius: 1,
  },
});

export default CourseTabs;
