// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';

// Screens
import LoginScreen from './src/authentication/Login';
import Home from './src/screens/Home';
import Dashboard from './src/screens/Dashboard';
import CourseDetail from './src/screens/CourseDetail';
import Calendar from './src/screens/Calendar';
import TodoScreen from './src/screens/TodoScreen';
import Notifications from './src/screens/Notification';
import Inbox from './src/screens/Inbox';

// Type for stack navigator
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

// Create stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  useEffect(() => {
    const init = async () => {
      try {
        // Simulate delay (e.g. for loading assets)
        await new Promise(resolve => setTimeout(resolve, 2000));
        await BootSplash.hide({ fade: true });
      } catch (error) {
        console.log('BootSplash error:', error);
      }
    };

    init();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="CourseDetail" component={CourseDetail} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="TodoScreen" component={TodoScreen} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Inbox" component={Inbox} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;