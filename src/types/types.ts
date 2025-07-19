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
  Modules: {course: Course};
  AssignmentList: {course: Course};
  DiscussionList: {course:Course};
  AnnouncementDetails: {
    announcementId: number;
    courseColor: string;
    courseTitle: string;
  };
  AssignmentQuestions:{
    assignmentId: number;
    color: string;
  }
  DiscussionDetails: {
    discussionId: number;
    color: string;
  }
  ModuleDetails: {
    moduleId: number;
    courseColor: string;
    courseTitle: string;
    currentChapterIndex: number;
    allChapters: Array<{id: number; name: string}>;
    moduleName: string;
  };
  Calendar: undefined;
  TodoScreen: undefined;
  Notifications: undefined;
  Inbox: undefined;
};
