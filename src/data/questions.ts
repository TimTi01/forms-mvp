import type { Question } from '../types'

export const questions: Question[] = [
  {
    id: 'length',
    title: 'Какая длина кухни?',
    type: 'number',
    min: 1.5,
    max: 8,
    step: 0.1,
    unit: 'м',
    defaultValue: 3,
  },
  {
    id: 'layout',
    title: 'Какая планировка кухни?',
    type: 'select',
    options: [
      { value: 'linear', label: 'Линейная', priceImpact: { type: 'multiply', value: 1 } },
      { value: 'corner', label: 'Угловая (Г)', priceImpact: { type: 'multiply', value: 1.15 } },
      { value: 'galley', label: 'Двухрядная (параллельная)', priceImpact: { type: 'multiply', value: 1.2 } },
      { value: 'u_shape', label: 'П-образная', priceImpact: { type: 'multiply', value: 1.3 } },
      { value: 'island', label: 'С островом', priceImpact: { type: 'multiply', value: 1.45 } },
    ],
    defaultValue: 'linear',
  },
  {
    id: 'facade',
    title: 'Материал фасадов',
    type: 'select',
    options: [
      { value: 'ldsp', label: 'ЛДСП', priceImpact: { type: 'multiply', value: 1 } },
      { value: 'mdf_paint', label: 'МДФ крашеный', priceImpact: { type: 'multiply', value: 1.4 } },
      { value: 'mdf_film', label: 'МДФ плёнка', priceImpact: { type: 'multiply', value: 1.25 } },
      { value: 'acrylic', label: 'Акрил', priceImpact: { type: 'multiply', value: 1.8 } },
    ],
    defaultValue: 'ldsp',
  },
  {
    id: 'countertop',
    title: 'Столешница',
    type: 'select',
    options: [
      { value: 'ldsp', label: 'ЛДСП', priceImpact: { type: 'multiply', value: 1 } },
      { value: 'stone', label: 'Искусственный камень', priceImpact: { type: 'multiply', value: 2.5 } },
      { value: 'quartz', label: 'Кварц', priceImpact: { type: 'multiply', value: 3 } },
    ],
    defaultValue: 'ldsp',
  },
  {
    id: 'hardware',
    title: 'Фурнитура',
    type: 'select',
    options: [
      { value: 'basic', label: 'Базовая', priceImpact: { type: 'multiply', value: 1 } },
      { value: 'standard', label: 'Стандарт', priceImpact: { type: 'multiply', value: 1.3 } },
      { value: 'premium', label: 'Премиум (Blum/Hettich)', priceImpact: { type: 'multiply', value: 1.8 } },
    ],
    defaultValue: 'standard',
  },
  {
    id: 'modules',
    title: 'Количество модулей',
    type: 'number',
    min: 4,
    max: 30,
    step: 1,
    defaultValue: 10,
  },
  {
    id: 'nonStandard',
    title: 'Нестандартные элементы',
    type: 'select',
    dependsOn: { questionId: 'layout', value: ['corner', 'galley', 'u_shape', 'island'] },
    options: [
      { value: 'none', label: 'Нет', priceImpact: { type: 'multiply', value: 1 } },
      { value: 'few', label: '1–2 элемента', priceImpact: { type: 'multiply', value: 1.15 } },
      { value: 'many', label: '3+ элемента', priceImpact: { type: 'multiply', value: 1.35 } },
    ],
    defaultValue: 'none',
  },
  {
    id: 'appliances',
    title: 'Встроенная техника',
    type: 'select',
    options: [
      { value: 'none', label: 'Без техники', priceImpact: { type: 'add', value: 0 } },
      { value: 'basic', label: 'Базовый комплект', priceImpact: { type: 'add', value: 45000 } },
      { value: 'full', label: 'Полный комплект', priceImpact: { type: 'add', value: 120000 } },
    ],
    defaultValue: 'none',
  },
]

export const KANBAN_COLUMNS: { id: import('../types').LeadStatus; title: string }[] = [
  { id: 'new', title: 'Новые' },
  { id: 'in_progress', title: 'В работе' },
  { id: 'measurement', title: 'Замер' },
  { id: 'approval', title: 'Согласование' },
  { id: 'success', title: 'Успешно' },
]

export function getVisibleQuestions(answers: Record<string, string | number | boolean>): Question[] {
  return questions.filter((q) => {
    if (!q.dependsOn) return true
    const answer = answers[q.dependsOn.questionId]
    const required = q.dependsOn.value
    if (Array.isArray(required)) return required.includes(String(answer))
    return String(answer) === required
  })
}

export function getQuestionLabel(questionId: string, value: string | number | boolean): string {
  const q = questions.find((item) => item.id === questionId)
  if (!q) return String(value)
  if (q.type === 'select' && q.options) {
    const opt = q.options.find((o) => o.value === String(value))
    return opt?.label ?? String(value)
  }
  if (q.unit) return `${value} ${q.unit}`
  return String(value)
}
