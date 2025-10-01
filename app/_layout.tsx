import { Stack } from 'expo-router';
import GlobalNavigation from '../components/GlobalNavigation';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GlobalNavigation>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="home" />
          <Stack.Screen name="add" />
          <Stack.Screen name="goals" />
          <Stack.Screen name="social" />
          <Stack.Screen name="profile" />
        </Stack>
      </GlobalNavigation>
    </ThemeProvider>
  );
}