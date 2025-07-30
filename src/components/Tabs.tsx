import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

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
  const scrollViewRef = useRef<ScrollView>(null);
  const tabRefs = useRef<{[key: string]: View | null}>({});

  // Auto scroll to active tab
  useEffect(() => {
    const activeTabIndex = tabs.findIndex(tab => tab.label === activeTab);
    if (activeTabIndex !== -1 && scrollViewRef.current) {
      // Calculate approximate position - each tab is roughly 100-120px wide
      const tabWidth = 100; // Approximate tab width
      const scrollPosition = Math.max(0, activeTabIndex * tabWidth - screenWidth / 2 + tabWidth / 2);
      
      scrollViewRef.current.scrollTo({
        x: scrollPosition,
        animated: true,
      });
    }
  }, [activeTab, tabs]);

  // Alternative method using onLayout for more precise positioning
  const scrollToActiveTab = () => {
    const activeTabRef = tabRefs.current[activeTab];
    if (activeTabRef && scrollViewRef.current) {
      activeTabRef.measureLayout(
        scrollViewRef.current.getInnerViewNode(),
        (x, y, width, height) => {
          const scrollX = Math.max(0, x - (screenWidth - width) / 2);
          scrollViewRef.current?.scrollTo({
            x: scrollX,
            animated: true,
          });
        },
        () => {
          // Fallback if measureLayout fails
          console.log('measureLayout failed');
        }
      );
    }
  };

  // Call scrollToActiveTab when activeTab changes
  useEffect(() => {
    // Small delay to ensure layout is complete
    const timer = setTimeout(scrollToActiveTab, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        bounces={false}
        decelerationRate="fast">
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.label}
            ref={ref => (tabRefs.current[tab.label] = ref)}
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
    minWidth: 80, // Ensure minimum width for consistent spacing
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