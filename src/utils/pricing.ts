import { questions } from '../data/questions'
import type { Answers, PriceResult } from '../types'

const BASE_PER_METER = 45000
const MODULE_COST = 2500
const SPREAD = 0.12

function getOptionImpact(questionId: string, value: string | number | boolean) {
  const q = questions.find((item) => item.id === questionId)
  if (!q?.options) return null
  return q.options.find((o) => o.value === String(value))?.priceImpact ?? null
}

export function calculatePrice(answers: Answers): PriceResult {
  const length = Number(answers.length) || 3
  const modules = Number(answers.modules) || 10

  let total = length * BASE_PER_METER + modules * MODULE_COST

  for (const [key, value] of Object.entries(answers)) {
    if (key === 'length' || key === 'modules') continue
    const impact = getOptionImpact(key, value)
    if (!impact) continue

    if (typeof impact === 'number') {
      total += impact
    } else if (impact.type === 'multiply') {
      total *= impact.value
    } else if (impact.type === 'add') {
      total += impact.value
    }
  }

  total = Math.round(total)
  const min = Math.round(total * (1 - SPREAD))
  const max = Math.round(total * (1 + SPREAD))

  return {
    total,
    min,
    max,
    formatted: `${min.toLocaleString('ru-RU')} – ${max.toLocaleString('ru-RU')} ₽`,
  }
}
