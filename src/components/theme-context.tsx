'use client'

import { Theme, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { ToggleButton } from "@fluentui/react-components";
import { WeatherMoon28Regular, WeatherSunny28Filled } from "@fluentui/react-icons";
import React, { useEffect } from "react";

export const SetTopLevelThemeContext = React.createContext<React.Dispatch<React.SetStateAction<Partial<Theme>>>>(() => {});

export const getSystemTheme = (): Partial<Theme> => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? webDarkTheme
        : webLightTheme;
    }
    return webLightTheme;
};

export function ThemeToggle() {

    const SetTopLevelTheme = React.useContext(SetTopLevelThemeContext);
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    const handleToggle = () => {
        setIsDarkMode(!isDarkMode);
        SetTopLevelTheme((theme) => theme === webLightTheme ? webDarkTheme : webLightTheme);
    };

    useEffect(() => {
        setIsDarkMode(getSystemTheme() === webDarkTheme);
    }, []);

    return (
        <ToggleButton
            icon={isDarkMode ? <WeatherSunny28Filled /> : <WeatherMoon28Regular />}
            onClick={handleToggle}
            checked={isDarkMode}
            size="small"
            shape="circular"
        >
            {isDarkMode ? "Light" : "Dark"}
        </ToggleButton>
    );
}