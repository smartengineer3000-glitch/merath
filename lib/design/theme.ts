export const lightTheme = {
  colors: {
    primary: '#0D7C66',        // deep teal
    primaryLight: '#D4F1E8',
    secondary: '#D4A843',      // gold
    secondaryLight: '#F9EFD4',
    background: '#FDF9F2',     // sand
    surface: '#FFFFFF',
    surfaceVariant: '#F0ECE2',
    error: '#C62828',
    success: '#2E7D32',
    warning: '#E65100',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#1C1B1F',
    onSurface: '#1C1B1F',
    outline: '#A49E93',
    shadow: '#000000',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 16, full: 999 },
  typography: {
    h1: {  fontSize: 32, lineHeight: 40 },
    h2: {  fontSize: 24, lineHeight: 32 },
    h3: {  fontSize: 20, lineHeight: 28 },
    body: {  fontSize: 16, lineHeight: 24 },
    caption: {  fontSize: 12, lineHeight: 16 },
    button: {  fontSize: 14, lineHeight: 20 },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    primary: '#6DD5B8',
    primaryLight: '#0A4D3E',
    secondary: '#F0D060',
    secondaryLight: '#5E4A1A',
    background: '#1C1A18',
    surface: '#2A2724',
    surfaceVariant: '#3E3A35',
    error: '#FFB4AB',
    success: '#81C784',
    warning: '#FFB951',
    onPrimary: '#00382A',
    onSecondary: '#1C1500',
    onBackground: '#E6E1D9',
    onSurface: '#E6E1D9',
    outline: '#8A8378',
    shadow: '#000000',
  },
};
