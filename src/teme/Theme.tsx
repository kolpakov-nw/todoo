import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme
} from '@mui/material';
import {
  ThemeProvider as StyledThemeProvider,
  StyleSheetManager
} from 'styled-components';
import { getThemeFromStorage, saveThemeToStorage } from '../save/localStorage';

interface ThemeContextValue {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const Theme = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderContextProps {
  children: ReactNode;
}

export const ThemeProviderContext = ({
                                       children
                                     }: ThemeProviderContextProps) => {
  const [mode, setMode] = useState<'light' | 'dark'>(getThemeFromStorage());

  const toggleTheme = useCallback((): void => {
    setMode((prevMode) => {
      const nextMode = prevMode === 'light' ? 'dark' : 'light';
      saveThemeToStorage(nextMode);
      return nextMode;
    });
  }, []);

  const theme = useMemo(
      () =>
          createTheme({
            palette: {
              mode,
              primary: {
                main: mode === 'light' ? '#4a4a4c' : '#4e5758'
              },
              background: {
                default: mode === 'light' ? '#f5f7fb' : '#121212',
                paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
              }
            },
            shape: {
              borderRadius: 12
            },
            typography: {
              fontFamily:
                  '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
            }
          }),
      [mode]
  );

  const value = useMemo(
      () => ({
        mode,
        toggleTheme
      }),
      [mode, toggleTheme]
  );

  return (
      <Theme.Provider value={value}>
        <StyleSheetManager enableVendorPrefixes>
          <MuiThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </StyledThemeProvider>
          </MuiThemeProvider>
        </StyleSheetManager>
      </Theme.Provider>
  );
};

export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(Theme);

  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProviderContext');
  }

  return context;
};