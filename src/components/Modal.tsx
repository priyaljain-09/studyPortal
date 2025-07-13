import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setShowToast } from '../redux/slice/application';

const ModalToast = () => {
  const dispatch = useDispatch();
  const { toastMessage, showWarningModal, type } = useSelector(
    (state: RootState) => state.applicationData
  );

  const handleClose = () => {
    dispatch(
      setShowToast({
        show: false,
        toastMessage: '',
        title: '',
      })
    );
  };

  return (
    <Modal
      transparent
      visible={showWarningModal}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Triangle Warning Icon */}
          <Text style={styles.icon}>⚠️</Text>

          {/* Title */}
          <Text style={styles.title}>{type || 'Error!'}</Text>

          {/* Message */}
          <Text style={styles.message}>
            {toastMessage || 'An unexpected error occurred. Please try again!'}
          </Text>

          {/* OK Button */}
          <Pressable style={styles.okButton} onPress={handleClose}>
            <Text style={styles.okText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ModalToast;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },
  icon: {
    fontSize: 42,
    color: '#f87171',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 20,
  },
  okButton: {
    borderWidth: 1,
    borderColor: '#f87171',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#fef2f2',
  },
  okText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});
