// App.tsx
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

// Screens
import LoginScreen from './src/authentication/Login';
import Home from './src/screens/Home';
import Dashboard from './src/screens/Dashboard';
import CourseDetail from './src/screens/CourseDetail';
import Calendar from './src/screens/Calendar';
import TodoScreen from './src/screens/TodoScreen';
import Notifications from './src/screens/Notification';
import Inbox from './src/screens/Inbox';
import {RootState} from './src/redux/store';
import {loginsuccess} from './src/redux/slice/application';

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Home: undefined;
  CourseDetail: {
    course: {
      id: number;
      title: string;
      subtitle: string;
      color: string;
    };
  };
  Calendar: undefined;
  TodoScreen: undefined;
  Notifications: undefined;
  Inbox: undefined;
};

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
