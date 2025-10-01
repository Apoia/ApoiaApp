import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createComponentStyles } from '../styles/ComponentStyles';

interface SocialPostProps {
  post: {
    id: number;
    user: {
      name: string;
      profileImage: string;
    };
    activity: {
      type: string;
      icon: string;
      text: string;
      points: string;
      time: string;
    };
    likes: number;
    comments: number;
    commentsList: Array<{
      user: string;
      text: string;
    }>;
  };
}

export default function SocialPost({ post }: SocialPostProps) {
  const { colors } = useTheme();
  const styles = createComponentStyles(colors);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <View style={styles.socialPost}>
      <View style={styles.socialPostHeader}>
        <View style={styles.socialPostAvatar}>
          <Text style={styles.socialPostAvatarText}>
            {getInitials(post.user.name)}
          </Text>
        </View>
        <View style={styles.socialPostUserInfo}>
          <Text style={styles.socialPostUserName}>{post.user.name}</Text>
          <Text style={styles.socialPostTime}>{post.activity.time}</Text>
        </View>
      </View>
      
      <View style={styles.socialPostContent}>
        <Text style={styles.socialPostActivity}>
          {post.activity.text}
        </Text>
      </View>
      
      <View style={styles.socialPostActions}>
        <TouchableOpacity style={styles.socialPostAction}>
          <Ionicons name="heart-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.socialPostActionText}>{post.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.socialPostAction}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.socialPostActionText}>{post.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.socialPostAction}>
          <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}