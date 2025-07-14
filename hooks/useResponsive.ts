import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Breakpoints } from '@/constants/theme';

interface ScreenData {
  width: number;
  height: number;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useResponsive(): ScreenData {
  const [screenData, setScreenData] = useState<ScreenData>(() => {
    const { width, height } = Dimensions.get('window');
    return {
      width,
      height,
      isSmall: width < Breakpoints.sm,
      isMedium: width >= Breakpoints.sm && width < Breakpoints.md,
      isLarge: width >= Breakpoints.md && width < Breakpoints.lg,
      isTablet: width >= Breakpoints.md && width < Breakpoints.xl,
      isDesktop: width >= Breakpoints.xl,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const { width, height } = window;
      setScreenData({
        width,
        height,
        isSmall: width < Breakpoints.sm,
        isMedium: width >= Breakpoints.sm && width < Breakpoints.md,
        isLarge: width >= Breakpoints.md && width < Breakpoints.lg,
        isTablet: width >= Breakpoints.md && width < Breakpoints.xl,
        isDesktop: width >= Breakpoints.xl,
      });
    });

    return () => subscription?.remove();
  }, []);

  return screenData;
}