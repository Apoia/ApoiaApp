import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CustomAlert from '../components/CustomAlert';
import { useTheme } from '../contexts/ThemeContext';
import { useUserData } from '../hooks/useUserData';
import apiService from '../utils/apiService';
import { createEditProfileStyles } from '../styles/EditProfileStyles';
import { formatPhone, parsePhone } from '../utils/masks';

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { userData, loadUserData } = useUserData();
  const styles = createEditProfileStyles(colors);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [alert, setAlert] = useState({
    visible: false,
    type: 'error' as 'success' | 'error' | 'warning',
    title: '',
    message: ''
  });

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [telefoneDisplay, setTelefoneDisplay] = useState('');
  const [imagemPerfilUrl, setImagemPerfilUrl] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [alterarSenha, setAlterarSenha] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoadingData(true);
      const response = await apiService.get('/usuario');
      
      if (response.success && response.data) {
        setNome(response.data.nome || '');
        setEmail(response.data.email || '');
        const telefoneValue = response.data.telefone || '';
        setTelefone(telefoneValue);
        setTelefoneDisplay(telefoneValue ? formatPhone(telefoneValue) : '');
        setImagemPerfilUrl(response.data.imagem_perfil_url || '');
      }
    } catch (error) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar dados do perfil'
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha o nome'
      });
      return;
    }

    if (!email.trim()) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha o email'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Email inválido'
      });
      return;
    }

    if (alterarSenha) {
      if (!senhaAtual.trim()) {
        setAlert({
          visible: true,
          type: 'warning',
          title: 'Atenção',
          message: 'Preencha a senha atual'
        });
        return;
      }

      if (!senhaNova.trim() || senhaNova.length < 6) {
        setAlert({
          visible: true,
          type: 'warning',
          title: 'Atenção',
          message: 'A nova senha deve ter pelo menos 6 caracteres'
        });
        return;
      }

      if (senhaNova !== confirmarSenha) {
        setAlert({
          visible: true,
          type: 'warning',
          title: 'Atenção',
          message: 'As senhas não coincidem'
        });
        return;
      }
    }

    setLoading(true);

    try {
      const data: any = {
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim() || null,
        imagem_perfil_url: imagemPerfilUrl.trim() || null,
      };
      
      if (!data.telefone) {
        data.telefone = null;
      }

      if (alterarSenha) {
        data.senha_atual = senhaAtual;
        data.senha_nova = senhaNova;
      }

      const response = await apiService.put('/usuario', data);

      if (response.success) {
        setAlert({
          visible: true,
          type: 'success',
          title: 'Sucesso!',
          message: 'Perfil atualizado com sucesso'
        });

        await loadUserData();

        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        setAlert({
          visible: true,
          type: 'error',
          title: 'Erro',
          message: response.message || 'Erro ao atualizar perfil'
        });
      }
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      setAlert({
        visible: true,
        type: 'error',
        title: 'Erro',
        message: error.response?.data?.message || 'Erro ao conectar com o servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Nome */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              value={nome}
              onChangeText={setNome}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Telefone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="+55 (85) 99775-2527"
              value={telefoneDisplay}
              onChangeText={(text) => {
                const formatted = formatPhone(text);
                setTelefoneDisplay(formatted);
                setTelefone(parsePhone(formatted));
              }}
              keyboardType="phone-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* URL da Imagem de Perfil */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>URL da Imagem de Perfil</Text>
            <TextInput
              style={styles.input}
              placeholder="https://..."
              value={imagemPerfilUrl}
              onChangeText={setImagemPerfilUrl}
              keyboardType="url"
              autoCapitalize="none"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Alterar Senha */}
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAlterarSenha(!alterarSenha)}
            >
              <View style={[
                styles.checkbox,
                alterarSenha && styles.checkboxChecked
              ]}>
                {alterarSenha && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>Alterar senha</Text>
            </TouchableOpacity>
          </View>

          {/* Campos de senha (aparecem se alterarSenha for true) */}
          {alterarSenha && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Senha Atual *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua senha atual"
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                  secureTextEntry
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Nova Senha *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  value={senhaNova}
                  onChangeText={setSenhaNova}
                  secureTextEntry
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Confirmar Nova Senha *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite a nova senha novamente"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </>
          )}

          {/* Botão Salvar */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>
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

