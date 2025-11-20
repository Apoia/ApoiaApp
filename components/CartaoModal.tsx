import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface CartaoModalProps {
  visible: boolean;
  onClose: () => void;
  onCadastrar: () => void;
}

export default function CartaoModal({ visible, onClose, onCadastrar }: CartaoModalProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="card-outline" size={60} color={colors.primary} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>Nenhum cartão cadastrado</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            Para usar cartão de crédito ou débito, você precisa cadastrar pelo menos um cartão primeiro.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.buttonPrimary, { backgroundColor: colors.primary }]} 
              onPress={onCadastrar}
              activeOpacity={0.75}
            >
              <View style={styles.buttonIconWrapper}>
                <Ionicons name="card" size={26} color="#fff" />
              </View>
              <Text style={styles.buttonText}>Cadastrar Cartão</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.buttonCancel, { borderColor: colors.border }]} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonTextCancel, { color: colors.text }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
    gap: 14,
  },
  buttonPrimary: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    gap: 14,
  },
  buttonIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },
  buttonCancel: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    minHeight: 48,
  },
  buttonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

