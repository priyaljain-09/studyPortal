export type Course = {
  id: number;
  title: string;
  description: string;
  color: string;
};

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Home: undefined;
  CourseDetail: { course: Course };
  CourseAnnouncements: {course: Course}
  CourseHome: { course: Course };
  AnnouncementDetails: {
    announcementId: number;
    courseColor: string;
    courseTitle: string;
  };
  Calendar: undefined;
  TodoScreen: undefined;
  Notifications: undefined;
  Inbox: undefined;
};
