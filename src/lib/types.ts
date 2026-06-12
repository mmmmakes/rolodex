export interface Update {
  id: string
  title: string
  summary: string
  date: string
  notes: string | null
  notes_date: string | null
  sent_message: boolean
  sent_message_date: string | null
  new: boolean
}

export interface Contact {
  id: string
  name: string
  date_added: string
  birthday: string | null
  last_updated: string
  last_contacted: string
  phone: string | null
  email: string
  website: string | null
  linkedin: string | null
  instagram: string | null
  tags: string[]
  updates: Update[]
}

export type ViewMode = 'rolodex' | 'list'
export type SortField = 'date_added' | 'last_contacted' | 'last_updated' | 'birthday'
