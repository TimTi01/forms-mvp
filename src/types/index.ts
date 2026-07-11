export type QuestionType = 'select' | 'number' | 'boolean'

export interface QuestionOption {
  value: string
  label: string
  priceImpact?: number | { type: 'multiply'; value: number } | { type: 'add'; value: number }
}

export interface QuestionDependsOn {
  questionId: string
  value: string | string[]
}

export interface Question {
  id: string
  title: string
  type: QuestionType
  options?: QuestionOption[]
  min?: number
  max?: number
  step?: number
  unit?: string
  defaultValue?: string | number | boolean
  dependsOn?: QuestionDependsOn
}

export type Answers = Record<string, string | number | boolean>

export type LeadStatus = 'new' | 'in_progress' | 'measurement' | 'approval' | 'success'

export interface Lead {
  id: string
  name: string
  phone: string
  totalPrice: number
  priceRange: string
  answers: Answers
  createdAt: string
  status: LeadStatus
}

export interface PriceResult {
  total: number
  min: number
  max: number
  formatted: string
}
