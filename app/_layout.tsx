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
          <Stack.Screen name="add-despesa" />
          <Stack.Screen name="add-receita" />
          <Stack.Screen name="cadastrar-cartao" />
          <Stack.Screen name="criar-meta" />
          <Stack.Screen name="cadastrar-despesa-fixa" />
          <Stack.Screen name="despesas-fixas" />
          <Stack.Screen name="goals" />
          <Stack.Screen name="social" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="edit-profile" />
          <Stack.Screen name="movimentacoes" />
        </Stack>
      </GlobalNavigation>
    </ThemeProvider>
  );
}