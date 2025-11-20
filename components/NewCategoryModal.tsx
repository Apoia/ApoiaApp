import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { borderRadius, shadows, spacing } from '../styles/theme';

interface NewCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (categoryName: string) => void;
  type?: 'despesa' | 'receita';
}

export default function NewCategoryModal({ 
  visible, 
  onClose, 
  onSave,
  type = 'despesa'
}: NewCategoryModalProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [categoryName, setCategoryName] = useState('');

  const handleSave = () => {
    if (categoryName.trim()) {
      onSave(categoryName.trim());
      setCategoryName('');
      onClose();
    }
  };

  const handleClose = () => {
    setCategoryName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="add-circle" size={32} color={colors.primary} />
              </View>
              <Text style={styles.title}>Nova Categoria</Text>
              <Text style={styles.subtitle}>
                Crie uma categoria personalizada para {type === 'despesa' ? 'despesas' : 'receitas'}
              </Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.label}>Nome da Categoria</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Assinaturas, Presentes..."
                value={categoryName}
                onChangeText={setCategoryName}
                placeholderTextColor={colors.textSecondary}
                autoFocus
                maxLength={30}
              />
              <Text style={styles.helperText}>
                Máximo de 30 caracteres
              </Text>
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.saveButton,
                  { backgroundColor: colors.primary },
                  !categoryName.trim() && styles.saveButtonDisabled
                ]}
                onPress={handleSave}
                disabled={!categoryName.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  keyboardView: {
    width: '100%',
    maxWidth: 400,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    ...shadows.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.border + '40',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    ...shadows.small,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

