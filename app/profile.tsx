import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AchievementCard from '../components/AchievementCard';
import ProfileStatsCard from '../components/ProfileStatsCard';
import SettingItem from '../components/SettingItem';
import { useTheme } from '../contexts/ThemeContext';
import mockData from '../data/mockData.json';
import { useUserData } from '../hooks/useUserData';
import { createProfileStyles } from '../styles/ProfileStyles';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { userData, logout } = useUserData();
  const styles = createProfileStyles(colors);
  const [settings, setSettings] = useState(
    mockData.profile.settings.map(setting => ({
      ...setting,
      value: setting.id === 2 ? isDarkMode : setting.value
    }))
  );

  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const handleSettingPress = (settingId: number) => {
    console.log('Setting pressed:', settingId);
  };

  const handleSettingToggle = (settingId: number, value: boolean) => {
    if (settingId === 2) { 
      toggleDarkMode();
    }
    setSettings(prev => prev.map(setting => 
      setting.id === settingId ? { ...setting, value } : setting
    ));
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const earnedAchievements = mockData.profile.achievements.filter(a => a.earned).length;
  const totalAchievements = mockData.profile.achievements.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Conteúdo Principal */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Seção do Perfil */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(userData?.name || mockData.profile.user.name).charAt(0)}</Text>
            </View>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData?.name || mockData.profile.user.name}</Text>
            <Text style={styles.userEmail}>{userData?.email || mockData.profile.user.email}</Text>
            <Text style={styles.userLevel}>Nível {mockData.profile.user.level}</Text>
          </View>
        </View>

        {/* Estatísticas Financeiras */}
        <ProfileStatsCard stats={mockData.profile.stats} />

        {/* Conquistas */}
        <View style={styles.achievementsSection}>
          <View style={styles.achievementsHeader}>
            <Text style={styles.achievementsTitle}>Conquistas</Text>
            <Text style={styles.achievementsCount}>
              {earnedAchievements} de {totalAchievements} desbloqueadas
            </Text>
          </View>
          <View style={styles.achievementsList}>
            {mockData.profile.achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </View>
        </View>

        {/* Configurações */}
        <View style={styles.settingsSection}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>Configurações</Text>
          </View>
          <View style={styles.settingsList}>
            {settings.map((setting) => (
              <SettingItem
                key={setting.id}
                setting={setting}
                onPress={() => handleSettingPress(setting.id)}
                onToggle={(value) => handleSettingToggle(setting.id, value)}
              />
            ))}
          </View>
        </View>

        {/* Botão de Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="exit-outline" size={20} color={colors.error} />
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        {/* Espaço para navegação inferior */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}