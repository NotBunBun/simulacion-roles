
import { createTheme, PaletteOptions } from '@mui/material/styles'

const palette: PaletteOptions = {
  background: {
    default: '#0a0a0a',
    paper: '#000000',
  },
  primary: {
    main: '#000000',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#6e00cc',
    light: '#b55eff',
    dark: '#450089',
    contrastText: '#ffffff',
  },
  error: {
    main: '#f44336',
    light: '#ff7961',
    dark: '#ba000d',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
  },
  text: {
    primary: '#ffffff',
    secondary: '#cccccc',
  },
}

const theme = createTheme({
  palette,
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '3rem',
      lineHeight: 1.1,
      fontWeight: 700,
      textShadow: '0 0 12px rgba(110,0,204,0.8), 0 0 24px rgba(69,0,137,0.8)',
    },
    h2: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '2rem',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    caption: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.75rem',
      color: '#cccccc',
    },
    button: {
      fontFamily: 'Inter, sans-serif',
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 8,
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          backgroundColor: '#0a0a0a',
        },
        body: {
          backgroundColor: '#0a0a0a',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        containedSecondary: {
          backgroundColor: '#6e00cc',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#5a00a8',
          },
        },
        outlinedSecondary: {
          borderColor: '#6e00cc',
          color: '#b55eff',
          '&:hover': {
            borderColor: '#b55eff',
            backgroundColor: 'rgba(110, 0, 204, 0.05)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '2px solid #6e00cc',
          boxShadow: '0 4px 20px rgba(110,0,204,0.5)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0a0a0a',
          borderLeft: '2px solid #6e00cc',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#b55eff',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0a0a0a',
          border: '1px solid #6e00cc',
          boxShadow: '0 8px 32px rgba(110,0,204,0.4)',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-standardSuccess': {
            backgroundColor: '#4caf50',
            color: '#ffffff',
            boxShadow: '0 0 16px rgba(76,175,80,0.6)',
          },
        },
      },
    },
  },
})

export default theme
