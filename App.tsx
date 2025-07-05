// App.tsx
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

// Screens
import LoginScreen from './src/authentication/Login';
import Home from './src/student/screens/Home';
import Dashboard from './src/student/screens/Dashboard';
import CourseDetail from './src/student/Course/CourseDetail';
import Calendar from './src/student/screens/Calendar';
import TodoScreen from './src/student/screens/TodoScreen';
import Notifications from './src/student/screens/Notification';
import Inbox from './src/student/screens/Inbox';
import {RootState} from './src/redux/store';
import {loginsuccess} from './src/redux/slice/application';
import CourseHome from './src/student/Course/CourseHome';
import CourseAnnouncements from './src/student/Course/Announcement';
import { RootStackParamList } from './src/types/types';
import AnnouncementDetails from './src/student/Course/AnnouncemetDetail';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const dispatch = useDispatch();
  const {successLogin} = useSelector(
    (state: RootState) => state.applicationData,
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          dispatch(loginsuccess(true));
        }
      } catch (error) {
        console.log('Error checking token:', error);
      } finally {
        setIsChecking(false);
        BootSplash.hide({fade: true});
      }
    };

    checkLogin();
  }, []);

  if (isChecking) return null; // Show nothing while checking token

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {successLogin ? (
          <>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="CourseDetail" component={CourseDetail} />
            <Stack.Screen name="CourseHome" component={CourseHome} />
            <Stack.Screen name="CourseAnnouncements" component={CourseAnnouncements} />
            <Stack.Screen name="AnnouncementDetails" component={AnnouncementDetails} />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen name="TodoScreen" component={TodoScreen} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Inbox" component={Inbox} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
