import {
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  LinearProgress,
  TextField,
  Slide,
  useTheme,
  useMediaQuery,
  Paper,
  Slider,
  Chip,
  Stack,
  Fade,
  InputAdornment,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import { useState, useMemo, useCallback, forwardRef, type TransitionProps } from 'react'
import { getVisibleQuestions } from '../data/questions'
import { QUESTION_META, PHASE_META, getOptionIcon } from '../data/questionMeta'
import { calculatePrice } from '../utils/pricing'
import { useLeads } from '../store/LeadContext'
import KitchenPreview3D from './KitchenPreview3D'
import type { Answers } from '../types'

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface CalculatorModalProps {
  open: boolean
  onClose: () => void
}

function getDefaultAnswers(): Answers {
  const answers: Answers = {}
  for (const q of getVisibleQuestions({})) {
    if (q.defaultValue !== undefined) answers[q.id] = q.defaultValue
  }
  return answers
}

function PriceBadge({ price, large }: { price: { formatted: string; total: number }; large?: boolean }) {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 2,
        px: large ? 3 : 1.5,
        py: large ? 2 : 0.75,
        textAlign: large ? 'center' : 'right',
      }}
    >
      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
        Предварительно
      </Typography>
      <Typography variant={large ? 'h4' : 'body2'} fontWeight={700} sx={{ lineHeight: 1.2 }}>
        {price.formatted}
      </Typography>
    </Box>
  )
}

export default function CalculatorModal({ open, onClose }: CalculatorModalProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { addLead } = useLeads()

  const [answers, setAnswers] = useState<Answers>(getDefaultAnswers)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<'questions' | 'form' | 'success'>('questions')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [pendingValue, setPendingValue] = useState<number | null>(null)

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers])
  const currentQuestion = visibleQuestions[step]
  const progress = phase === 'questions' ? ((step + 1) / visibleQuestions.length) * 100 : 100
  const meta = currentQuestion ? QUESTION_META[currentQuestion.id] : null
  const QuestionIcon = meta?.icon

  const previewAnswers = useMemo(() => {
    if (pendingValue !== null && currentQuestion?.type === 'number') {
      return { ...answers, [currentQuestion.id]: pendingValue }
    }
    return answers
  }, [answers, pendingValue, currentQuestion])

  const price = useMemo(() => calculatePrice(previewAnswers), [previewAnswers])

  const modulesStepIndex = visibleQuestions.findIndex((q) => q.id === 'modules')
  const modulesStepPassed =
    phase !== 'questions' || (modulesStepIndex >= 0 && step > modulesStepIndex)

  const reset = useCallback(() => {
    setAnswers(getDefaultAnswers())
    setStep(0)
    setPhase('questions')
    setName('')
    setPhone('')
    setErrors({})
    setPendingValue(null)
  }, [])

  const handleClose = () => {
    onClose()
    setTimeout(reset, 300)
  }

  const handleAnswer = (value: string | number | boolean) => {
    if (!currentQuestion) return
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)
    setPendingValue(null)

    const newVisible = getVisibleQuestions(newAnswers)
    if (step < newVisible.length - 1) {
      setStep(step + 1)
    } else {
      setPhase('form')
    }
  }

  const handleBack = () => {
    if (phase === 'form') {
      setPhase('questions')
      setStep(visibleQuestions.length - 1)
    } else if (step > 0) {
      setStep(step - 1)
      setPendingValue(null)
    }
  }

  const handleSubmit = () => {
    const newErrors: { name?: string; phone?: string } = {}
    if (!name.trim()) newErrors.name = 'Укажите имя'
    if (!phone.trim()) newErrors.phone = 'Укажите телефон'
    else if (!/^[\d\s+()-]{7,}$/.test(phone)) newErrors.phone = 'Некорректный номер'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    addLead({
      id: `lead_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      totalPrice: price.total,
      priceRange: price.formatted,
      answers: { ...answers },
      createdAt: new Date().toISOString(),
    })
    setPhase('success')
  }

  const previewFocus = phase === 'form' || phase === 'success' ? 'overview' as const : meta?.previewFocus

  return (
    <Dialog
      fullScreen={isMobile}
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          ...(!isMobile && { height: '92vh', maxHeight: 720, borderRadius: 3 }),
          overflow: 'hidden',
          bgcolor: '#f8fafc',
        },
      }}
    >
      <AppBar
        position="relative"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {(step > 0 || phase === 'form') && phase !== 'success' && (
            <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="Назад">
              <ArrowBackRoundedIcon />
            </IconButton>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} noWrap>
              Расчёт кухни
            </Typography>
            {phase === 'questions' && currentQuestion && (
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Шаг {step + 1} из {visibleQuestions.length}
              </Typography>
            )}
          </Box>
          {!isMobile && phase !== 'success' && <PriceBadge price={price} />}
          <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="Закрыть">
            <CloseRoundedIcon />
          </IconButton>
        </Toolbar>
        {phase === 'questions' && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 4,
              bgcolor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': { bgcolor: '#e94560' },
            }}
          />
        )}
      </AppBar>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden' }}>
        {/* 3D Preview panel */}
        <Box
          sx={{
            flex: isMobile ? '0 0 auto' : '0 0 42%',
            p: 2,
            pb: isMobile ? 1 : 2,
            bgcolor: '#eef2f7',
            borderRight: isMobile ? 'none' : '1px solid',
            borderBottom: isMobile ? '1px solid' : 'none',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <KitchenPreview3D
            answers={previewAnswers}
            focus={previewFocus}
            modulesStepPassed={modulesStepPassed}
            compact={isMobile}
          />

          {isMobile && phase !== 'success' && (
            <PriceBadge price={price} large />
          )}

          {/* Step chips */}
          {phase === 'questions' && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {visibleQuestions.map((q, i) => {
                const QIcon = QUESTION_META[q.id]?.icon
                return (
                  <Chip
                    key={q.id}
                    size="small"
                    icon={QIcon ? <QIcon sx={{ fontSize: 14 }} /> : undefined}
                    label={i + 1}
                    variant={i === step ? 'filled' : i < step ? 'outlined' : 'outlined'}
                    color={i === step ? 'primary' : i < step ? 'success' : 'default'}
                    sx={{
                      opacity: i > step ? 0.45 : 1,
                      height: 26,
                      '& .MuiChip-icon': { ml: 0.5 },
                    }}
                  />
                )
              })}
            </Stack>
          )}
        </Box>

        {/* Form panel */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Fade in key={`${phase}-${step}`} timeout={300}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {phase === 'questions' && currentQuestion && meta && QuestionIcon && (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {/* Question header */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                      }}
                    >
                      <QuestionIcon />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700} lineHeight={1.3}>
                        {currentQuestion.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {meta.hint}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Select options */}
                  {currentQuestion.type === 'select' && (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: currentQuestion.options && currentQuestion.options.length > 2
                          ? { xs: '1fr', sm: '1fr 1fr' }
                          : '1fr',
                        gap: 1.5,
                      }}
                    >
                      {currentQuestion.options?.map((opt) => {
                        const OptIcon = getOptionIcon(currentQuestion.id, opt.value)
                        const selected = answers[currentQuestion.id] === opt.value
                        return (
                          <Paper
                            key={opt.value}
                            component="button"
                            elevation={selected ? 4 : 0}
                            onClick={() => handleAnswer(opt.value)}
                            sx={{
                              p: 2,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              cursor: 'pointer',
                              border: '2px solid',
                              borderColor: selected ? 'primary.main' : 'divider',
                              bgcolor: selected ? 'rgba(37, 99, 235, 0.08)' : 'background.paper',
                              borderRadius: 2,
                              textAlign: 'left',
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: 'primary.light',
                                transform: 'translateY(-1px)',
                                boxShadow: 2,
                              },
                            }}
                          >
                            {OptIcon && (
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 1.5,
                                  bgcolor: selected ? 'primary.main' : 'grey.100',
                                  color: selected ? 'white' : 'text.secondary',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  transition: 'all 0.2s',
                                }}
                              >
                                <OptIcon fontSize="small" />
                              </Box>
                            )}
                            <Typography variant="body1" fontWeight={selected ? 600 : 400} sx={{ flex: 1 }}>
                              {opt.label}
                            </Typography>
                            {selected && (
                              <CheckRoundedIcon color="primary" fontSize="small" />
                            )}
                          </Paper>
                        )
                      })}
                    </Box>
                  )}

                  {/* Number input with slider */}
                  {currentQuestion.type === 'number' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography
                          variant="h2"
                          fontWeight={800}
                          color="primary.main"
                          sx={{ lineHeight: 1 }}
                        >
                          {pendingValue ?? answers[currentQuestion.id] ?? currentQuestion.defaultValue}
                          {currentQuestion.unit && (
                            <Typography component="span" variant="h4" color="text.secondary" sx={{ ml: 0.5 }}>
                              {currentQuestion.unit}
                            </Typography>
                          )}
                        </Typography>
                      </Box>

                      <Slider
                        value={Number(pendingValue ?? answers[currentQuestion.id] ?? currentQuestion.defaultValue)}
                        min={currentQuestion.min}
                        max={currentQuestion.max}
                        step={currentQuestion.step}
                        onChange={(_, val) => setPendingValue(val as number)}
                        valueLabelDisplay="auto"
                        sx={{
                          '& .MuiSlider-thumb': { width: 22, height: 22 },
                          '& .MuiSlider-track': { height: 6 },
                          '& .MuiSlider-rail': { height: 6 },
                        }}
                      />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          {currentQuestion.min}{currentQuestion.unit}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {currentQuestion.max}{currentQuestion.unit}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => handleAnswer(Number(pendingValue ?? answers[currentQuestion.id] ?? currentQuestion.defaultValue))}
                        sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
                      >
                        Далее
                      </Button>
                    </Box>
                  )}
                </Box>
              )}

              {phase === 'form' && (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: 'secondary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <PHASE_META.form.icon />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>Оставьте контакты</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {PHASE_META.form.hint}
                      </Typography>
                    </Box>
                  </Box>

                  {!isMobile && <PriceBadge price={price} large />}

                  <TextField
                    label="Ваше имя"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineRoundedIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Телефон"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    placeholder="+7 (999) 123-45-67"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<SendRoundedIcon />}
                    onClick={handleSubmit}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      bgcolor: '#e94560',
                      '&:hover': { bgcolor: '#d63851' },
                    }}
                  >
                    Отправить заявку
                  </Button>
                </Box>
              )}

              {phase === 'success' && (
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    textAlign: 'center',
                    py: 4,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'rgba(22, 163, 74, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircleRoundedIcon sx={{ fontSize: 48, color: 'success.main' }} />
                  </Box>
                  <Typography variant="h5" fontWeight={700}>Заявка отправлена!</Typography>
                  <Typography color="text.secondary" sx={{ maxWidth: 320 }}>
                    Предварительная стоимость: <strong>{price.formatted}</strong>.
                    Менеджер свяжется с вами в ближайшее время.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleClose}
                    sx={{ mt: 2, borderRadius: 2, px: 4 }}
                  >
                    Закрыть
                  </Button>
                </Box>
              )}
            </Box>
          </Fade>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
