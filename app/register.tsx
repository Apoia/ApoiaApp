import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomAlert from '../components/CustomAlert';
import { AuthValidation } from '../utils/authValidation';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, type: 'error' as 'success' | 'error' | 'warning', title: '', message: '' });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await AuthValidation.isLoggedIn();
      if (isLoggedIn) {
        router.replace('/home');
      }
    };
    checkAuth();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setAlert({ visible: true, type: 'warning', title: 'Atenção', message: 'Preencha todos os campos para continuar' });
      return;
    }

    if (name.length < 2) {
      setAlert({ visible: true, type: 'error', title: 'Nome inválido', message: 'O nome deve ter pelo menos 2 caracteres' });
      return;
    }

    if (!validateEmail(email)) {
      setAlert({ visible: true, type: 'error', title: 'Email inválido', message: 'Por favor, digite um email válido' });
      return;
    }

    if (password.length < 6) {
      setAlert({ visible: true, type: 'error', title: 'Senha muito curta', message: 'A senha deve ter pelo menos 6 caracteres' });
      return;
    }

    setLoading(true);

    try {
      const registration = await AuthValidation.registerUser({ name, email, password });
      
      if (registration.success) {
        setAlert({ visible: true, type: 'success', title: 'Conta criada!', message: registration.message });
        setTimeout(() => router.replace('/home'), 1500);
      } else {
        setAlert({ visible: true, type: 'error', title: 'Erro no cadastro', message: registration.message });
      }
    } catch (error) {
      setAlert({ visible: true, type: 'error', title: 'Erro', message: 'Ocorreu um erro inesperado. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Junte-se à nossa comunidade</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#a0a0a0"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#a0a0a0"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#a0a0a0"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={24} 
                    color="#7f8c8d" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Criando conta...' : 'Criar conta'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.loginLink} 
              onPress={() => router.back()}
            >
              <Text style={styles.loginLinkText}>
                Já possui conta? <Text style={styles.loginLinkBold}>Entrar</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
  },

  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
  },
  eyeButton: {
    padding: 16,
  },
  registerButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  loginLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  loginLinkBold: {
    color: '#3498db',
    fontWeight: 'bold',
  },
});