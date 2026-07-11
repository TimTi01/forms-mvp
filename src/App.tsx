import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LeadProvider } from './store/LeadContext'
import LandingPage from './pages/LandingPage'
import BitrixPage from './pages/BitrixPage'
import SchemePage from './pages/SchemePage'

const theme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    secondary: { main: '#e94560' },
  },
  typography: {
    fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
  },
  shape: { borderRadius: 10 },
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LeadProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/bitrix" element={<BitrixPage />} />
            <Route path="/scheme" element={<SchemePage />} />
          </Routes>
        </BrowserRouter>
      </LeadProvider>
    </ThemeProvider>
  )
}
