'use client';

import * as React from 'react';
import {
  FluentProvider,
  SSRProvider,
  RendererProvider,
  createDOMRenderer,
  renderToStyleElements,
  webLightTheme,
  Theme,
  webDarkTheme,
} from '@fluentui/react-components';
import { useServerInsertedHTML } from 'next/navigation';
import { getSystemTheme, SetTopLevelThemeContext } from '@/components/theme-context'

export function Providers({ children }: { children: React.ReactNode }) {  

  const [theme, setTheme] = React.useState<Partial<Theme>>(webLightTheme);
  const [renderer] = React.useState(() => createDOMRenderer());
  const didRenderRef = React.useRef(false);

  useServerInsertedHTML(() => {
    if (didRenderRef.current) {
      return;
    }
    didRenderRef.current = true;
    return <>{renderToStyleElements(renderer)}</>;
  });

  // Causes dual render if default is dark mode on system
  // 1. can we remove this dual render?
  // 2. will this affect SEO?
  React.useEffect(() => {
    setTheme(getSystemTheme);
  }, []);

  return (
    <RendererProvider renderer={renderer}>
      <SSRProvider>
        <SetTopLevelThemeContext.Provider value={setTheme}>
          <FluentProvider theme={theme}>{children}</FluentProvider>
        </SetTopLevelThemeContext.Provider>
      </SSRProvider>
    </RendererProvider>
  );
}