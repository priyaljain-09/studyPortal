// src/components/BottomNavigation.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Calendar,
  Bell,
  Mail,
  Home,
  FileText,
} from 'lucide-react-native';

interface BottomNavigationProps {
  navigation: any;
  activeTab?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  navigation, 
  activeTab = 'Dashboard' 
}) => {
  const handleNavigation = (screenName: string) => {
    navigation.navigate(screenName);
  };

  const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    screenName: string;
    isActive?: boolean;
  }> = ({ icon, label, screenName, isActive = false }) => (
    <TouchableOpacity 
      style={styles.navItem}
      onPress={() => handleNavigation(screenName)}
    >
      {React.cloneElement(icon as React.ReactElement, {
        size: 24,
        color: isActive ? '#374151' : '#6B7280'
      })}
      <Text style={[
        styles.navText, 
        isActive ? styles.navTextActive : styles.navTextInactive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.bottomNav}>
      <NavItem
        icon={<Home />}
        label="Dashboard"
        screenName="Dashboard"
        isActive={activeTab === 'Dashboard'}
      />
      
      <NavItem
        icon={<Calendar />}
        label="Calendar"
        screenName="Calendar"
        isActive={activeTab === 'Calendar'}
      />
      
      <NavItem
        icon={<FileText />}
        label="To-do"
        screenName="TodoScreen"
        isActive={activeTab === 'TodoScreen'}
      />
      
      <NavItem
        icon={<Bell />}
        label="Notifications"
        screenName="Notifications"
        isActive={activeTab === 'Notifications'}
      />
      
      <NavItem
        icon={<Mail />}
        label="Inbox"
        screenName="Inbox"
        isActive={activeTab === 'Inbox'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
  navTextActive: {
    color: '#374151',
    fontWeight: '500',
  },
  navTextInactive: {
    color: '#6B7280',
  },
});

export default BottomNavigation;