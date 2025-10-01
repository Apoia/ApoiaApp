import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import SocialPost from '../components/SocialPost';
import { useTheme } from '../contexts/ThemeContext';
import mockData from '../data/mockData.json';
import { createSocialStyles } from '../styles/SocialStyles';

export default function SocialScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createSocialStyles(colors);

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Social</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Perfil do Usuário Atual */}
      <TouchableOpacity style={styles.profileSection} onPress={handleProfilePress}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>{mockData.social.currentUser.name.charAt(0)}</Text>
          </View>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{mockData.social.currentUser.name}</Text>
          <Text style={styles.followersText}>{mockData.social.currentUser.followers} seguidores</Text>
        </View>
      </TouchableOpacity>

      {/* Feed Social */}
      <ScrollView 
        style={styles.feed}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
      >
        {mockData.social.posts.map((post) => (
          <SocialPost key={post.id} post={post} />
        ))}
        
        {/* Espaço para navegação inferior */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

