// App.tsx
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {navigationRef} from './src/utils/navigationService';
import LoginScreen from './src/authentication/Login';
import Home from './src/student/screens/Home';
import Dashboard from './src/student/screens/Dashboard';
import CourseDetail from './src/student/Course/CourseDetail';
import Calendar from './src/student/screens/Calendar';
import TodoScreen from './src/student/screens/TodoScreen';
import Notifications from './src/student/screens/Notification';
import Inbox from './src/student/screens/Inbox';
import {RootState} from './src/redux/store';
import {loginsuccess, setShowToast} from './src/redux/slice/application';
import CourseHome from './src/student/Course/CourseHome';
import CourseAnnouncements from './src/student/Course/Announcement';
import {RootStackParamList} from './src/types/types';
import AnnouncementDetails from './src/student/Course/AnnouncemetDetail';
import Modules from './src/student/Course/Modules';
import ModuleDetails from './src/student/Course/ModulesDetail';
import Toast from './src/components/Toast';
import AssignmentList from './src/student/Course/Assignment';
import AssignmentQuestions from './src/student/Course/AssignmentQuestion';
import DiscussionList from './src/student/Course/Discussion';
import DiscussionDetails from './src/student/Course/DiscussionDetail';
import AssigmentDetails from './src/student/Course/AssigmentDetail';
import AssignmentSubmit from './src/student/Course/AssigmentSubmit';
import Grades from './src/student/Course/Grades';
import GradeDetail from './src/student/Course/GradesDetail';
import Syllabus from './src/student/Course/Syllabus';
import People from './src/student/Course/People';

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
        dispatch(
          setShowToast({
            show: true,
            type: 'error',
            toastMessage: error || 'Something went wrong!',
          }),
        );
      } finally {
        setIsChecking(false);
        BootSplash.hide({fade: true});
      }
    };

    checkLogin();
  }, []);

  if (isChecking) return null; // Show nothing while checking token

  return (
    <NavigationContainer ref={navigationRef}>
      <Toast />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {successLogin ? (
          <>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="CourseDetail" component={CourseDetail} />
            <Stack.Screen name="CourseHome" component={CourseHome} />
            <Stack.Screen
              name="CourseAnnouncements"
              component={CourseAnnouncements}
            />
            <Stack.Screen
              name="AnnouncementDetails"
              component={AnnouncementDetails}
            />
            <Stack.Screen name="Modules" component={Modules} />
            <Stack.Screen name="ModuleDetails" component={ModuleDetails} />
            <Stack.Screen
              name="AssigmentDetails"
              component={AssigmentDetails}
            />
            <Stack.Screen name="AssignmentList" component={AssignmentList} />
            <Stack.Screen
              name="AssignmentQuestions"
              component={AssignmentQuestions}
            />
            <Stack.Screen name="Grades" component={Grades} />
            <Stack.Screen name="People" component={People} />
            <Stack.Screen name="Syllabus" component={Syllabus} />
            <Stack.Screen
              name="GradeDetail"
              component={GradeDetail}
            />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen
              name="AssignmentSubmit"
              component={AssignmentSubmit}
            />
            <Stack.Screen name="DiscussionList" component={DiscussionList} />
            <Stack.Screen name="TodoScreen" component={TodoScreen} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Inbox" component={Inbox} />
            <Stack.Screen
              name="DiscussionDetails"
              component={DiscussionDetails}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
