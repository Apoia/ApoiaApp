import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { useTheme } from '../contexts/ThemeContext'
import { createComponentStyles } from '../styles/ComponentStyles'
import { spacing } from '../styles/theme'

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  unlocked: boolean
  points: number
}

interface AchievementCarouselProps {
  achievements: Achievement[]
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.7
const CARD_SPACING = spacing.sm
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_SPACING
const SIDE_CARD_WIDTH = (SCREEN_WIDTH - CARD_WIDTH) / 2
const CENTER_OFFSET = SIDE_CARD_WIDTH

export default function AchievementCarousel({ achievements }: AchievementCarouselProps) {
  const { colors, isDarkMode } = useTheme()
  const styles = createComponentStyles(colors)
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    if (achievements.length > 0 && flatListRef.current) {
      setTimeout(() => {
        scrollToIndex(0)
      }, 100)
    }
  }, [achievements.length])

  const scrollToIndex = (index: number) => {
    if (flatListRef.current && index >= 0 && index < achievements.length) {
      flatListRef.current.scrollToOffset({
        offset: SIDE_CARD_WIDTH + (CARD_TOTAL_WIDTH * index),
        animated: true
      })
    }
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x
    const adjustedPosition = scrollPosition - SIDE_CARD_WIDTH
    const index = Math.round(adjustedPosition / CARD_TOTAL_WIDTH)
    const clampedIndex = Math.max(0, Math.min(index, achievements.length - 1))
    if (clampedIndex !== activeIndex) {
      setActiveIndex(clampedIndex)
    }
  }

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x
    const adjustedPosition = scrollPosition - SIDE_CARD_WIDTH
    const index = Math.round(adjustedPosition / CARD_TOTAL_WIDTH)
    const clampedIndex = Math.max(0, Math.min(index, achievements.length - 1))
    scrollToIndex(clampedIndex)
  }

  const renderAchievement = ({ item, index }: { item: Achievement; index: number }) => {
    const isActive = index === activeIndex
    const distance = Math.abs(index - activeIndex)
    const isSide = distance === 1
    const isFar = distance > 1

    let scale = 1
    let opacity = 1
    if (isSide) {
      scale = 0.85
      opacity = 0.7
    } else if (isFar) {
      scale = 0.75
      opacity = 0.5
    }

    return (
      <View
        style={[
          carouselStyles.card,
          {
            width: CARD_WIDTH,
            marginRight: index < achievements.length - 1 ? CARD_SPACING : 0,
            backgroundColor: item.unlocked
              ? isDarkMode
                ? colors.primary + '20'
                : colors.primary + '10'
              : colors.surface,
            borderColor: item.unlocked ? colors.primary : colors.border,
            borderWidth: item.unlocked ? (isActive ? 2 : 1) : 1,
            opacity: item.unlocked ? opacity : opacity * 0.6,
            transform: [{ scale }],
            zIndex: isActive ? 10 : distance
          }
        ]}
      >
        <View
          style={[
            carouselStyles.iconContainer,
            {
              backgroundColor: item.unlocked
                ? colors.primary + '20'
                : colors.textSecondary + '10',
              width: isActive ? 70 : 60,
              height: isActive ? 70 : 60,
              borderRadius: isActive ? 35 : 30
            }
          ]}
        >
          <Ionicons
            name={item.icon as any}
            size={isActive ? 36 : 30}
            color={item.unlocked ? colors.primary : colors.textSecondary}
          />
          {item.unlocked && (
            <View
              style={[
                carouselStyles.unlockedBadge,
                {
                  backgroundColor: colors.success,
                  position: 'absolute',
                  top: -5,
                  right: -5
                }
              ]}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </View>
          )}
        </View>

        <Text
          style={[
            carouselStyles.title,
            {
              color: item.unlocked ? colors.text : colors.textSecondary,
              fontWeight: item.unlocked ? '700' : '600',
              fontSize: isActive ? 18 : 16
            }
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <Text
          style={[
            carouselStyles.description,
            {
              color: item.unlocked ? colors.textSecondary : colors.textSecondary + '80',
              textAlign: 'center',
              fontSize: isActive ? 13 : 12
            }
          ]}
          numberOfLines={isActive ? 3 : 2}
        >
          {item.description}
        </Text>

        <View
          style={[
            carouselStyles.pointsContainer,
            {
              backgroundColor: item.unlocked ? colors.primary + '20' : colors.border + '40'
            }
          ]}
        >
          <Ionicons
            name="star"
            size={16}
            color={item.unlocked ? colors.warning : colors.textSecondary}
          />
          <Text
            style={[
              carouselStyles.pointsText,
              {
                color: item.unlocked ? colors.warning : colors.textSecondary
              }
            ]}
          >
            {item.points} pontos
          </Text>
        </View>

        {!item.unlocked && (
          <View style={carouselStyles.lockedOverlay}>
            <Ionicons name="lock-closed" size={24} color={colors.textSecondary} />
            <Text style={[carouselStyles.lockedText, { color: colors.textSecondary }]}>
              Bloqueada
            </Text>
          </View>
        )}
      </View>
    )
  }

  const renderPagination = () => {
    if (achievements.length <= 1) return null

    return (
      <View style={carouselStyles.pagination}>
        {achievements.map((_, index) => (
          <View
            key={index}
            style={[
              carouselStyles.paginationDot,
              {
                backgroundColor: index === activeIndex ? colors.primary : colors.border,
                width: index === activeIndex ? 24 : 8,
                height: 8
              }
            ]}
          />
        ))}
      </View>
    )
  }

  if (achievements.length === 0) {
    return (
      <View style={carouselStyles.emptyContainer}>
        <Ionicons name="trophy-outline" size={48} color={colors.textSecondary} />
        <Text style={[carouselStyles.emptyText, { color: colors.textSecondary }]}>
          Nenhuma conquista disponível
        </Text>
      </View>
    )
  }

  return (
    <View style={carouselStyles.container}>
      <FlatList
        ref={flatListRef}
        data={achievements}
        renderItem={renderAchievement}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_TOTAL_WIDTH}
        snapToOffsets={achievements.map((_, index) => SIDE_CARD_WIDTH + (CARD_TOTAL_WIDTH * index))}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          carouselStyles.listContent,
          {
            paddingLeft: SIDE_CARD_WIDTH,
            paddingRight: SIDE_CARD_WIDTH
          }
        ]}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: CARD_TOTAL_WIDTH,
          offset: SIDE_CARD_WIDTH + (CARD_TOTAL_WIDTH * index),
          index
        })}
      />
      {renderPagination()}
    </View>
  )
}

const carouselStyles = StyleSheet.create({
  container: {
    marginVertical: spacing.md
  },
  listContent: {
    alignItems: 'center'
  },
  card: {
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    position: 'relative'
  },
  unlockedBadge: {
    borderRadius: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  title: {
    fontSize: 20,
    marginBottom: spacing.sm,
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    marginBottom: spacing.lg,
    lineHeight: 20
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    gap: spacing.xs
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600'
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs
  },
  lockedText: {
    fontSize: 12,
    fontWeight: '600'
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs
  },
  paginationDot: {
    borderRadius: 4,
    transition: 'all 0.3s ease'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center'
  }
})

