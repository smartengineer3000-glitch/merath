export const lightTheme = {
  colors: {
    primary: '#1B6B4A', primaryLight: '#D4E8D4', secondary: '#C5A04E', secondaryLight: '#F2E6C4',
    background: '#FCFCFF', surface: '#FFFFFF', surfaceVariant: '#F0F0F3',
    error: '#BA1A1A', success: '#2E7D32', warning: '#E65100',
    onPrimary: '#FFFFFF', onSecondary: '#FFFFFF', onBackground: '#1C1B1F', onSurface: '#1C1B1F',
    outline: '#79747E', shadow: '#000000',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 16, full: 999 },
  typography: {
    h1: { fontSize: 32, lineHeight: 40 }, h2: { fontSize: 24, lineHeight: 32 },
    h3: { fontSize: 20, lineHeight: 28 }, body: { fontSize: 16, lineHeight: 24 },
    caption: { fontSize: 12, lineHeight: 16 }, button: { fontSize: 14, lineHeight: 20 },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    primary: '#8CDA8C', primaryLight: '#004D31', secondary: '#DFC07A', secondaryLight: '#5E4300',
    background: '#1C1B1F', surface: '#252529', surfaceVariant: '#49454F',
    error: '#FFB4AB', success: '#81C784', warning: '#FFB951',
    onPrimary: '#00391E', onSecondary: '#3E2B00', onBackground: '#E6E1E5', onSurface: '#E6E1E5',
    outline: '#938F99', shadow: '#000000',
  },
};
