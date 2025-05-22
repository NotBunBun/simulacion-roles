
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
  text: {
    primary: '#ffffff',
    secondary: '#cccccc',
  },
}

const theme = createTheme({
  palette,
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '3rem',
      lineHeight: 1.1,
      textShadow: '0 0 12px rgba(110,0,204,0.8), 0 0 24px rgba(69,0,137,0.8)',
    },
    body1: {
      textShadow: '0 0 6px rgba(69,0,137,0.6)',
    },
    button: {
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: 500,
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
          boxShadow: '0px 4px 12px rgba(0,0,0,0.4)',
          fontFamily: 'Roboto, sans-serif',
        },
        containedSecondary: {
          backgroundColor: '#6e00cc',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#450089',
          },
        },
        outlinedSecondary: {
          borderColor: '#6e00cc',
          color: '#6e00cc',
          '&:hover': {
            borderColor: '#450089',
            color: '#450089',
          },
        },
      },
    },
  },
})

export default theme
