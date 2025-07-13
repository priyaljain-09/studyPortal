import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setShowToast } from '../redux/slice/application';

const validAlertTypes = ['success', 'error', 'warning', 'info', 'primary'] as const;
type AlertType = (typeof validAlertTypes)[number];

const Toast = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const dispatch = useDispatch();
  const { showToast, toastMessage, type } = useSelector(
    (state: RootState) => state.applicationData
  );

  const alertType: AlertType = validAlertTypes.includes(type as AlertType)
    ? (type as AlertType)
    : 'info';

  const getBackgroundColor = (type: AlertType) => {
    switch (type) {
      case 'success':
        return '#22c55e';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#facc15';
      case 'info':
        return '#3b82f6';
      case 'primary':
        return '#8b5cf6';
      default:
        return '#3b82f6';
    }
  };

  useEffect(() => {
    if (showToast) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            dispatch(setShowToast({ show: false, toastMessage: '' }));
          });
        }, 2000);
      });
    }
  }, [showToast]);

  if (!showToast) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        { opacity: fadeAnim, backgroundColor: getBackgroundColor(alertType) },
      ]}>
      <Text style={styles.text}>{toastMessage}</Text>
    </Animated.View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 100,
    left: 30,
    right: 30,
    padding: 14,
    borderRadius: 8,
    zIndex: 9999,
    elevation: 4,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
});
