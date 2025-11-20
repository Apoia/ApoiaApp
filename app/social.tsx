import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SocialPost from '../components/SocialPost';
import { useTheme } from '../contexts/ThemeContext';
import { useUserData } from '../hooks/useUserData';
import apiService from '../utils/apiService';
import { createSocialStyles } from '../styles/SocialStyles';

interface SocialPostData {
  id: number;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

interface SocialUser {
  name: string;
  followers: number;
}

export default function SocialScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { userData } = useUserData();
  const styles = createSocialStyles(colors);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<SocialPostData[]>([]);
  const [socialUser, setSocialUser] = useState<SocialUser | null>(null);

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    try {
      setLoading(true);

      try {
        const postsResponse = await apiService.get<{ success: boolean; data?: SocialPostData[] }>('/social/posts');
        if (postsResponse.success && postsResponse.data) {
          setPosts(postsResponse.data);
        }
      } catch (error) {
        setPosts([]);
      }

      try {
        const userResponse = await apiService.get<{ success: boolean; data?: SocialUser }>('/social/usuario');
        if (userResponse.success && userResponse.data) {
          setSocialUser(userResponse.data);
        }
      } catch (error) {
        setSocialUser(null);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleMenuPress = () => {
  };

  const handleProfilePress = () => {
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  const displayName = socialUser?.name || userData?.name || 'Usuário';
  const displayFollowers = socialUser?.followers ?? null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Social</Text>
        <View style={styles.placeholder} />
      </View>

      <TouchableOpacity style={styles.profileSection} onPress={handleProfilePress}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.followersText}>
            {displayFollowers !== null ? `${displayFollowers} seguidores` : 'Indisponível'}
          </Text>
        </View>
      </TouchableOpacity>

      <ScrollView 
        style={styles.feed}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
      >
        {posts.length > 0 ? (
          posts.map((post) => (
            <SocialPost key={post.id} post={post} />
          ))
        ) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={[styles.headerTitle, { color: colors.textSecondary }]}>
              Feed indisponível no momento
            </Text>
          </View>
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.messageInputContainer}>
        <View style={styles.messageInputWrapper}>
          <TextInput
            style={styles.messageInput}
            placeholder="Escreva uma mensagem..."
            value={messageText}
            onChangeText={setMessageText}
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={messageText.trim() ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
