import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {
  FileText,
  Video,
  Settings,
  HelpCircle,
  User,
  LogOut,
} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; 

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  onPress: () => void;
}

type SidebarNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<SidebarNavigationProps>();
  const handleLogout = (): void => {
    navigation.navigate('Login');
  };

  const menuItems: MenuItem[] = [
    { icon: FileText, label: 'Files', onPress: () => console.log('Files') },
    { icon: Video, label: 'Studio', onPress: () => console.log('Studio') },
    { icon: Settings, label: 'Settings', onPress: () => console.log('Settings') },
    { icon: HelpCircle, label: 'Help', onPress: () => console.log('Help') },
    { icon: User, label: 'Change user', onPress: () => console.log('Change user') },
    { icon: LogOut, label: 'Log out', onPress: handleLogout },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sidebar}>
          {/* Profile Header */}
          <View style={styles.sidebarHeader}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitials}>PJ</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Priyal</Text>
              <Text style={styles.profileEmail}>jain.priyal</Text>
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.sidebarContent}>
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.sidebarItem}
                  onPress={item.onPress}
                >
                  <IconComponent size={24} color="#6B7280" />
                  <Text style={styles.sidebarItemText}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={styles.sidebarFooter}>
            <Text style={styles.versionText}>Study Portal @2025</Text>
          </View>
        </View>

        {/* Tap outside to close */}
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 300,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  sidebarHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  profileInitials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  profileInfo: {
    gap: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 16,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  sidebarItemText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  sidebarFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default Sidebar;
