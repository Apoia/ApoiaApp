import { useEffect, useState } from 'react';
import { Dimensions, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useSafeArea() {
  const insets = useSafeAreaInsets();
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'android') {
      setStatusBarHeight(StatusBar.currentHeight || 0);
    } else {
      setStatusBarHeight(insets.top);
    }
  }, [insets.top]);

  const getHeaderPadding = () => {
    if (Platform.OS === 'ios') {
      return insets.top + 16; 
    } else {
      return (StatusBar.currentHeight || 0) + 16; 
    }
  };

  const getBottomPadding = () => {
    return insets.bottom + 16; 
  };

  const isSmallScreen = () => {
    const { height } = Dimensions.get('window');
    return height < 700;
  };

  const getResponsiveSpacing = (baseSpacing: number) => {
    const { width } = Dimensions.get('window');
    if (width < 375) {
      return baseSpacing * 0.8; 
    } else if (width > 414) {
      return baseSpacing * 1.2; 
    }
    return baseSpacing;
  };

  return {
    insets,
    statusBarHeight,
    getHeaderPadding,
    getBottomPadding,
    isSmallScreen,
    getResponsiveSpacing,
  };
}


