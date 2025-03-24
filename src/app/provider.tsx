'use client';

import { ConfigProvider, theme, ThemeConfig } from 'antd';
import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEY, ThemeMode, ThemeModeContext } from '../components/theme-context';
import getDesignToken from 'antd/es/theme/getDesignToken';

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
        document.body.style.backgroundColor = systemTheme === ThemeMode.Dark ? '#292929' : '#ffffff';
        setMode(systemTheme);
    }
    else{
        const theme = (localStorage.getItem(LOCAL_STORAGE_KEY) as ThemeMode) || ThemeMode.Light;
        document.body.style.backgroundColor = theme === ThemeMode.Dark ? '#292929' : '#ffffff';
        setMode(theme);
    }
  }, []);

  const tokens = getDesignToken()

  const themeStruct: ThemeConfig = {
    algorithm: mode === ThemeMode.Dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    cssVar: true,
    token: {
      colorPrimary: '#0f6cbd',
    },
    components: {
      Layout: {
        headerBg: mode === ThemeMode.Dark ? '#292929' : tokens.colorBgBase,
        bodyBg: mode === ThemeMode.Dark ? '#292929' : tokens.colorBgBase,
        footerBg: mode === ThemeMode.Dark ? '#292929' : tokens.colorBgBase,
        headerHeight: '48px',
      },
    }
  }

  return (
    <>
      <style>
      {/* Use this to generate the filter used below: https://isotropic.co/tool/hex-color-to-css-filter/ */}
        {`
          :root {
            --logo-color-filter: ${mode === ThemeMode.Dark? "": "brightness(0) saturate(100%) invert(13%) sepia(0%) saturate(1468%) hue-rotate(248deg) brightness(102%) contrast(92%)"};
          }
        `}
      </style>
      <ThemeModeContext.Provider value={ThemeContextStruct}>
          <ConfigProvider theme={themeStruct}>
              {children}
          </ConfigProvider>
      </ThemeModeContext.Provider>
    </>
  );
};
