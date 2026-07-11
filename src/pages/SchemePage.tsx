import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Paper,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import GroupsIcon from '@mui/icons-material/Groups'

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </Box>
  )
}

const BEFORE_STEPS = [
  'Клиент заполняет форму',
  'Менеджер получает ответы',
  'Менеджер вручную считает стоимость',
  'Менеджер перезванивает клиенту',
]

const AFTER_STEPS = [
  'Клиент заполняет форму',
  'Система сразу считает стоимость',
  'Менеджер получает готовую заявку',
  'Менеджер перезванивает клиенту',
]

const STATS = [
  { icon: <AccessTimeIcon sx={{ fontSize: 40 }} />, value: '15–20 мин', label: 'на расчёт одной заявки вручную' },
  { icon: <MoneyOffIcon sx={{ fontSize: 40 }} />, value: 'до 40%', label: 'лидов теряется из-за долгого ответа' },
  { icon: <GroupsIcon sx={{ fontSize: 40 }} />, value: '3 сегмента', label: 'квалификация: горячие, тёплые, холодные' },
]

export default function SchemePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f0f1a', color: 'white' }}>
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(8px)' }}>
        <Toolbar>
          <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>Презентация MVP</Typography>
          <Button component={RouterLink} to="/" color="inherit" size="small">Лендинг</Button>
          <Button component={RouterLink} to="/bitrix" color="inherit" size="small">CRM</Button>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pt: 8 }}>
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ letterSpacing: 4, opacity: 0.6 }}>Калькулятор-воронка</Typography>
          <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, mt: 2, mb: 3 }}>
            Как автоматический расчёт меняет продажи
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, fontWeight: 400, mb: 4 }}>
            Сравнение процесса до и после внедрения
          </Typography>
          <ArrowDownwardIcon sx={{ opacity: 0.4, animation: 'bounce 2s infinite', '@keyframes bounce': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(10px)' } } }} />
        </Container>
      </Box>

      {/* Before */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <AnimatedSection>
          <Typography variant="h4" fontWeight={700} gutterBottom color="#ff6b6b">Как сейчас</Typography>
          <Typography sx={{ opacity: 0.7, mb: 4 }}>Текущий процесс обработки заявки</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {BEFORE_STEPS.map((step, i) => (
              <Paper
                key={step}
                sx={{
                  p: 2.5,
                  bgcolor: 'rgba(255,107,107,0.1)',
                  border: '1px solid rgba(255,107,107,0.3)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#ff6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </Box>
                <Typography>{step}</Typography>
              </Paper>
            ))}
          </Box>
        </AnimatedSection>
      </Container>

      {/* After */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <AnimatedSection delay={100}>
          <Typography variant="h4" fontWeight={700} gutterBottom color="#51cf66">Как будет</Typography>
          <Typography sx={{ opacity: 0.7, mb: 4 }}>Процесс с калькулятором-воронкой</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {AFTER_STEPS.map((step, i) => (
              <Paper
                key={step}
                sx={{
                  p: 2.5,
                  bgcolor: 'rgba(81,207,102,0.1)',
                  border: '1px solid rgba(81,207,102,0.3)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#51cf66', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </Box>
                <Typography>{step}</Typography>
              </Paper>
            ))}
          </Box>
        </AnimatedSection>
      </Container>

      {/* Stats */}
      <Container maxWidth="md" sx={{ py: 8, pb: 12 }}>
        <AnimatedSection delay={200}>
          <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center">Цифры</Typography>
          <Typography sx={{ opacity: 0.7, mb: 5, textAlign: 'center' }}>Почему это важно для бизнеса</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {STATS.map((stat) => (
              <Paper
                key={stat.label}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                }}
              >
                <Box sx={{ color: '#e94560', mb: 2 }}>{stat.icon}</Box>
                <Typography variant="h4" fontWeight={800} color="#e94560">{stat.value}</Typography>
                <Typography sx={{ opacity: 0.7, mt: 1 }}>{stat.label}</Typography>
              </Paper>
            ))}
          </Box>
        </AnimatedSection>
      </Container>
    </Box>
  )
}
