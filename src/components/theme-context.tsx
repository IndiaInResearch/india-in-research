'use client'

import { MoonOutlined, SunFilled } from '@ant-design/icons';
import { Switch } from 'antd';
import { createContext, useContext } from 'react';

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

export const ThemeModeContext = createContext({
  mode: ThemeMode.Light,
  setMode: (_: ThemeMode) => {},
});

export const LOCAL_STORAGE_KEY = 'theme';

export const ThemeToggle = () => {
    const { mode, setMode } = useContext(ThemeModeContext);
  
    return (
        <Switch
          checked={mode === ThemeMode.Dark}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunFilled />}
          onChange={(value) => {
            const themeMode = value ? ThemeMode.Dark : ThemeMode.Light;
            localStorage.setItem(LOCAL_STORAGE_KEY, themeMode);
            setMode(themeMode);
          }}
        />
    );
  };