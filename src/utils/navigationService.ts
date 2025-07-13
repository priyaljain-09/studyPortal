import { createNavigationContainerRef, NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string, params?: Record<string, any>) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
