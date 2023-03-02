export interface E621Post {
  id: number
  created_at: string
  updated_at: string
  file: {
    md5: string
    ext: string
    size: number
    width: number
    height: number
    url: string
  }
  sample: {
    has: boolean
    height: number
    width: number
    url: string
  }
  preview: {
    height: number
    width: number
    url: string
  }
  tags: {
    general: T
    species: T
    character: T
    artist: T
    invalid: T
    lore: T
    meta: T
  }
  locked_tags: T
  change_seq: number
  flags: {
    pending: boolean
    flagged: boolean
    note_locked: boolean
    status_locked: boolean
    rating_locked: boolean
    deleted: boolean
  }
  rating: 's' | 'q' | 'e'
  fav_count: number
  sources: T
  pools: T
  relationships: {
    parent_id: number
    has_children: boolean
    has_active_children: boolean
    children: T
  }
  approver_id: number
  uploader_id: number
  description: string
  comment_count: number
  is_favorited: boolean
  duration: number
  score: {
    up: number
    down: number
    total: number
  }
  has_notes: boolean
  has_comments: boolean
  has_children: boolean
  children: T
  parent_id: number
}

// This is intended to extend the type above (E621Post) with additional properties, mainly fav_count, etc.

export interface E621PostExtended extends E621Post {
  fav_count: number
}
