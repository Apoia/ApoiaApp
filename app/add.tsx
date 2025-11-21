import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createAddStyles } from '../styles/AddStyles';

export default function AddScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const styles = createAddStyles(colors);

  const options = [
    {
      id: 'expense',
      title: 'Despesa',
      subtitle: 'Registre uma nova despesa',
      icon: 'remove-circle',
      color: isDarkMode ? '#F87171' : '#EF4444',
      gradient: isDarkMode 
        ? ['#7F1D1D', '#991B1B'] // Dark: vermelho escuro
        : ['#FEE2E2', '#FEF2F2'], // Light: vermelho claro
      onPress: () => router.push('/add-despesa'),
    },
    {
      id: 'income',
      title: 'Renda',
      subtitle: 'Registre uma nova entrada',
      icon: 'add-circle',
      color: isDarkMode ? '#34D399' : '#10B981',
      gradient: isDarkMode 
        ? ['#064E3B', '#065F46'] // Dark: verde escuro
        : ['#D1FAE5', '#ECFDF5'], // Light: verde claro
      onPress: () => router.push('/add-receita'),
    },
    {
      id: 'fixed',
      title: 'Despesa Fixa',
      subtitle: 'Gerencie contas recorrentes',
      icon: 'calendar',
      color: isDarkMode ? '#FBBF24' : '#F59E0B',
      gradient: isDarkMode 
        ? ['#78350F', '#92400E'] // Dark: laranja escuro
        : ['#FEF3C7', '#FFFBEB'], // Light: laranja claro
      onPress: () => router.push('/despesas-fixas'),
    },
  ];

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>O que deseja adicionar?</Text>
            <Text style={styles.subtitle}>Escolha uma das opções abaixo</Text>
          </View>

          <View style={styles.optionsGrid}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  { 
                    backgroundColor: isDarkMode ? colors.surface : option.gradient[1],
                    borderColor: isDarkMode ? option.color + '40' : option.color + '30',
                  }
                ]}
                onPress={option.onPress}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.iconWrapper, 
                  { 
                    backgroundColor: isDarkMode 
                      ? option.color + '20' 
                      : option.gradient[0] 
                  }
                ]}>
                  <Ionicons name={option.icon as any} size={40} color={option.color} />
                </View>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  {option.title}
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                  {option.subtitle}
                </Text>
                <View style={[styles.arrowIcon, { backgroundColor: option.color }]}>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
