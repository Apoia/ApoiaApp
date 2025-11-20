import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import AboutModal from '../components/AboutModal'
import AchievementCard from '../components/AchievementCard'
import PasswordVerificationModal from '../components/PasswordVerificationModal'
import ProfileStatsCard from '../components/ProfileStatsCard'
import SettingItem from '../components/SettingItem'
import { useTheme } from '../contexts/ThemeContext'
import { useUserData } from '../hooks/useUserData'
import { createProfileStyles } from '../styles/ProfileStyles'
import apiService from '../utils/apiService'

interface ProfileStats {
  totalSaved: number
  totalInvested: number
  debtPaid: number
  monthlyBudget: number
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  unlocked: boolean
  points: number
}

export default function ProfileScreen() {
  const router = useRouter()
  const { colors, isDarkMode, toggleDarkMode } = useTheme()
  const { userData, logout } = useUserData()
  const styles = createProfileStyles(colors)

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [level, setLevel] = useState<number | null>(null)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [settings, setSettings] = useState([
    {
      id: 1,
      title: 'Notificações',
      description: 'Receber notificações',
      icon: 'notifications-outline',
      type: 'toggle' as const,
      value: true
    },
    {
      id: 2,
      title: 'Modo Escuro',
      description: 'Tema escuro',
      icon: 'moon-outline',
      type: 'toggle' as const,
      value: isDarkMode
    },
    {
      id: 3,
      title: 'Movimentações',
      description: 'Ver todas as transações',
      icon: 'receipt-outline',
      type: 'navigation' as const,
      value: false
    },
    {
      id: 4,
      title: 'Sobre',
      description: 'Informações do app',
      icon: 'information-circle-outline',
      type: 'navigation' as const,
      value: false
    }
  ])

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)

      try {
        const statsResponse = await apiService.get<{ success: boolean; data?: ProfileStats }>(
          '/estatisticas'
        )
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data)
        }
      } catch (error) {
        setStats(null)
      }

      try {
        const gamificacaoResponse = await apiService.get<{
          success: boolean
          data?: { nivel?: number; conquistas?: any[] }
        }>('/gamificacao')
        if (gamificacaoResponse.success && gamificacaoResponse.data) {
          setLevel(gamificacaoResponse.data.nivel || null)
          const conquistas = (gamificacaoResponse.data.conquistas || []).map((c: any) => ({
            id: c.id,
            title: c.title || c.titulo,
            description: c.description || c.descricao,
            icon: c.icon || c.icone,
            unlocked: c.unlocked ?? c.earned ?? false,
            points: c.points || c.pontos || 0
          }))
          setAchievements(conquistas)
        }
      } catch (error) {
        setLevel(null)
        setAchievements([])
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfile = () => {
    router.push('/edit-profile')
  }

  const handleSettingPress = (settingId: number) => {
    if (settingId === 3) {
      setShowPasswordModal(true)
    } else if (settingId === 4) {
      setShowAboutModal(true)
    }
  }

  const handlePasswordVerified = () => {
    setShowPasswordModal(false)
    router.push('/movimentacoes')
  }

  const handleCloseAboutModal = () => {
    setShowAboutModal(false)
  }

  const handleSettingToggle = (settingId: number, value: boolean) => {
    if (settingId === 2) {
      toggleDarkMode()
    }
    setSettings((prev) =>
      prev.map((setting) => (setting.id === settingId ? { ...setting, value } : setting))
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.replace('/login')
    } catch (error) {}
  }

  const defaultStats: ProfileStats = {
    totalSaved: 0,
    totalInvested: 0,
    debtPaid: 0,
    monthlyBudget: 0
  }

  const displayStats = stats || defaultStats
  const earnedAchievements = achievements.filter((a) => a.unlocked).length
  const totalAchievements = achievements.length || 0

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(userData?.name || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData?.name || '-'}</Text>
            <Text style={styles.userEmail}>{userData?.email || '-'}</Text>
            <Text style={styles.userLevel}>
              {level !== null ? `Nível ${level}` : 'Nível Indisponível'}
            </Text>
          </View>
        </View>

        <ProfileStatsCard stats={displayStats} />

        <View style={styles.achievementsSection}>
          <View style={styles.achievementsHeader}>
            <Text style={styles.achievementsTitle}>Conquistas</Text>
            <Text style={styles.achievementsCount}>
              {totalAchievements > 0
                ? `${earnedAchievements} de ${totalAchievements} desbloqueadas`
                : 'Indisponível'}
            </Text>
          </View>
          {achievements.length > 0 ? (
            <View style={styles.achievementsList}>
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </View>
          ) : (
            <View style={styles.achievementsList}>
              <Text
                style={[
                  styles.achievementsTitle,
                  { color: colors.textSecondary, textAlign: 'center', padding: 20 }
                ]}
              >
                Conquistas indisponíveis no momento
              </Text>
            </View>
          )}
        </View>

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
                onToggle={() => handleSettingToggle(setting.id, !setting.value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="exit-outline" size={20} color={colors.error} />
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <PasswordVerificationModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordVerified}
        title="Verificação de Senha"
        message="Digite sua senha para acessar suas movimentações"
      />

      <AboutModal visible={showAboutModal} onClose={handleCloseAboutModal} />
    </SafeAreaView>
  )
}
