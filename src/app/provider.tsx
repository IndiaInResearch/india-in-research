'use client';

import { ConfigProvider, theme, ThemeConfig } from 'antd';
import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEY, ThemeMode, ThemeModeContext } from '../components/theme-context';

const getSystemTheme = (): Partial<ThemeMode> => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ThemeMode.Dark
        : ThemeMode.Light;
    }
    return ThemeMode.Light;
};

export const AntdConfigProvider = ({ children }: {children: React.ReactNode}) => {
  const [mode, setMode] = useState<ThemeMode>(ThemeMode.Light);
  const ThemeContextStruct = {mode, setMode};

  // Causes dual render if default is dark mode on system
  // 1. can we remove this dual render?
  // 2. will this affect SEO?
  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_KEY) === null) {
        const systemTheme = getSystemTheme();
        localStorage.setItem(LOCAL_STORAGE_KEY, systemTheme);
        setMode(systemTheme);
    }
    else{
        const theme = (localStorage.getItem(LOCAL_STORAGE_KEY) as ThemeMode) || ThemeMode.Light;
        setMode(theme);
    }
  }, []);

  const themeStruct: ThemeConfig = {
    algorithm: mode === ThemeMode.Dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    cssVar: true
  }

  return (
    <ThemeModeContext.Provider value={ThemeContextStruct}>
        <ConfigProvider theme={themeStruct}>
            {children}
        </ConfigProvider>
    </ThemeModeContext.Provider>
  );
};
