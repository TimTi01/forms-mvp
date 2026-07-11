import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Lead, LeadStatus } from '../types'

const STORAGE_KEY = 'kitchen_mvp_leads'

interface LeadContextValue {
  leads: Lead[]
  addLead: (lead: Omit<Lead, 'status'>) => void
  updateLeadStatus: (id: string, status: LeadStatus) => void
}

const LeadContext = createContext<LeadContextValue | null>(null)

function loadLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(loadLeads)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
  }, [leads])

  const addLead = useCallback((lead: Omit<Lead, 'status'>) => {
    setLeads((prev) => [{ ...lead, status: 'new' as LeadStatus }, ...prev])
  }, [])

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }, [])

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLeadStatus }}>
      {children}
    </LeadContext.Provider>
  )
}

export function useLeads() {
  const ctx = useContext(LeadContext)
  if (!ctx) throw new Error('useLeads must be used within LeadProvider')
  return ctx
}
