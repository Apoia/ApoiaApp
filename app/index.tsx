import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { AuthValidation } from '../utils/authValidation';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await AuthValidation.isLoggedIn();
        setTimeout(() => {
          router.replace(isLoggedIn ? '/home' : '/login');
        }, 2000);
      } catch (error) {
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});