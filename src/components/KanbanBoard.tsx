import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Menu,
  MenuItem,
} from '@mui/material'
import { KANBAN_COLUMNS } from '../data/questions'
import { useLeads } from '../store/LeadContext'
import LeadModal from './LeadModal'
import type { Lead, LeadStatus } from '../types'

export default function KanbanBoard() {
  const { leads, updateLeadStatus } = useLeads()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [menuLead, setMenuLead] = useState<Lead | null>(null)

  const handleContextMenu = (e: React.MouseEvent, lead: Lead) => {
    e.preventDefault()
    setMenuAnchor(e.currentTarget as HTMLElement)
    setMenuLead(lead)
  }

  const handleMove = (status: LeadStatus) => {
    if (menuLead) updateLeadStatus(menuLead.id, status)
    setMenuAnchor(null)
    setMenuLead(null)
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, minHeight: 'calc(100vh - 120px)' }}>
        {KANBAN_COLUMNS.map((col) => {
          const columnLeads = leads.filter((l) => l.status === col.id)
          return (
            <Paper
              key={col.id}
              sx={{
                minWidth: 260,
                flex: '0 0 260px',
                bgcolor: '#f5f6fa',
                p: 1.5,
                borderRadius: 2,
              }}
              elevation={0}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, px: 0.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>{col.title}</Typography>
                <Typography
                  variant="caption"
                  sx={{ bgcolor: 'primary.main', color: 'white', px: 1, borderRadius: 10, fontWeight: 600 }}
                >
                  {columnLeads.length}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {columnLeads.map((lead) => (
                  <Card key={lead.id} elevation={1} onContextMenu={(e) => handleContextMenu(e, lead)}>
                    <CardActionArea onClick={() => setSelectedLead(lead)}>
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="subtitle2" fontWeight={600} noWrap>
                          {lead.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {lead.phone}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 0.5 }}>
                          {lead.priceRange}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}

                {columnLeads.length === 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 2, textAlign: 'center' }}>
                    Нет лидов
                  </Typography>
                )}
              </Box>
            </Paper>
          )
        })}
      </Box>

      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
        <MenuItem disabled sx={{ opacity: '1 !important', fontWeight: 600, fontSize: '0.75rem' }}>
          Переместить в
        </MenuItem>
        {KANBAN_COLUMNS.filter((c) => c.id !== menuLead?.status).map((col) => (
          <MenuItem key={col.id} onClick={() => handleMove(col.id)}>
            {col.title}
          </MenuItem>
        ))}
      </Menu>

      <LeadModal
        lead={selectedLead}
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </>
  )
}
