import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createAddStyles } from '../styles/AddStyles';

export default function AddScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createAddStyles(colors);

  const handleAddExpense = () => {
    
    console.log('Adicionar despesa');
  };

  const handleAddIncome = () => {
    
    console.log('Adicionar renda');
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        <Text style={styles.mainQuestion}>O que você quer adicionar?</Text>
        
        {/* Card Adicionar Despesa */}
        <TouchableOpacity style={styles.card} onPress={handleAddExpense}>
          <View style={styles.cardIcon}>
            <View style={styles.expenseIconBackground}>
              <Ionicons name="cash-outline" size={32} color={colors.error} />
            </View>
          </View>
          <Text style={styles.cardTitle}>Adicionar Despesa</Text>
          <Text style={styles.cardDescription}>Registre uma nova despesa</Text>
        </TouchableOpacity>

        {/* Card Adicionar Renda */}
        <TouchableOpacity style={styles.card} onPress={handleAddIncome}>
          <View style={styles.cardIcon}>
            <View style={styles.incomeIconBackground}>
              <Ionicons name="wallet-outline" size={32} color={colors.success} />
            </View>
          </View>
          <Text style={styles.cardTitle}>Adicionar Renda</Text>
          <Text style={styles.cardDescription}>Registre uma nova entrada</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

