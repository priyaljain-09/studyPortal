import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import Home from './src/screens/Home';
import BootSplash from 'react-native-bootsplash';

const App = () => {
  useEffect(() => {
    const init = async () => {
      try {
        // Wait 2 seconds then hide splash
        setTimeout(async () => {
          await BootSplash.hide({ fade: true });
        }, 2000);
      } catch (error) {
        console.log('BootSplash error:', error);
      }
    };

    init();
  }, []);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Home />
    </SafeAreaView>
  );
};

export default App;
