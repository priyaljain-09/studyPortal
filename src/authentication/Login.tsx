import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; 

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    navigation.navigate('Dashboard');
    Alert.alert('Login', 'Login functionality would be implemented here');
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign-in logic here
    Alert.alert('Google Sign In', 'Google sign-in functionality would be implemented here');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Brand Name */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Euniq</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Login to your Account</Text>

        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Dropdown/Picker */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue: any) => setSelectedValue(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" color="#999999" />
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Teacher" value="teacher" />
            <Picker.Item label="Parents" value="parents" />
          </Picker>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Sign In Button */}
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.8}
        >
          <View style={styles.googleButtonContent}>
            <View style={styles.googleIcon}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>
              Sign in with Google
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // bg-gray-50
  },
  content: {
    flex: 1,
    paddingHorizontal: 32, // px-8
    paddingTop: 64, // pt-16
    justifyContent: 'center',
  },

  // Logo styles
  logoContainer: {
    alignItems: 'center',
    marginBottom: 64, // mb-16
  },
  logoText: {
    fontSize: 48, // text-5xl
    fontWeight: '300', // font-light
    color: '#000000', // text-black
    letterSpacing: 2, // tracking-wider
  },

  // Title styles
  title: {
    fontSize: 24, // text-2xl
    fontWeight: '400', // font-normal
    color: '#000000', // text-black
    textAlign: 'center',
    marginBottom: 40, // mb-10
  },

  // Input styles
  inputWrapper: {
    marginBottom: 16, // mb-4
  },
  input: {
    height: 56, // h-14
    backgroundColor: '#ffffff', // bg-white
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 20, // px-5
    fontSize: 16, // text-base
    color: '#000000', // text-black
    borderWidth: 1,
    borderColor: '#e5e7eb', // border-gray-200
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Picker styles
  pickerWrapper: {
    marginBottom: 32, // mb-8
    backgroundColor: '#ffffff', // bg-white
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: '#e5e7eb', // border-gray-200
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  picker: {
    height: 56, // h-14
    color: '#000000', // text-black
  },

  // Button styles
  loginButton: {
    height: 56, // h-14
    backgroundColor: '#1e40af', // bg-blue-800
    borderRadius: 12, // rounded-xl
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32, // mb-8
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#ffffff', // text-white
    fontSize: 18, // text-lg
    fontWeight: '500', // font-medium
  },

  // Divider styles
  dividerContainer: {
    flexDirection: 'row', // flex-row
    alignItems: 'center',
    marginBottom: 32, // mb-8
  },
  dividerLine: {
    flex: 1, // flex-1
    height: 1, // h-px
    backgroundColor: '#d1d5db', // bg-gray-300
  },
  dividerText: {
    marginHorizontal: 16, // mx-4
    fontSize: 16, // text-base
    color: '#6b7280', // text-gray-500
  },

  // Google button styles
  googleButton: {
    height: 56, // h-14
    backgroundColor: '#ffffff', // bg-white
    borderRadius: 12, // rounded-xl
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb', // border-gray-200
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonContent: {
    flexDirection: 'row', // flex-row
    alignItems: 'center',
  },
  googleIcon: {
    width: 24, // w-6
    height: 24, // h-6
    backgroundColor: '#3b82f6', // bg-blue-500
    borderRadius: 6, // rounded-lg
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, // mr-3
  },
  googleIconText: {
    color: '#ffffff', // text-white
    fontSize: 14, // text-sm
    fontWeight: 'bold', // font-bold
  },
  googleButtonText: {
    color: '#374151', // text-gray-700
    fontSize: 16, // text-base
    fontWeight: '500', // font-medium
  },
});

export default LoginScreen;