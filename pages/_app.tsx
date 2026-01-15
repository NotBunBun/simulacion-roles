import '../src/app/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '../src/app/theme'
import { AuthProvider } from '../src/app/context/AuthContext'
import { DataProvider } from '../src/app/context/DataContext'
import Layout from '../src/app/components/layout/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DataProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default MyApp