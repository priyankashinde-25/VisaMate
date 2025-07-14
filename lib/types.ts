export interface Source {
  document_title: string
  source_type: string
  upload_date: string
  chunk_text: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  timestamp: Date
}

export interface ChatRequest {
  message: string
  history: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

export interface ChatResponse {
  answer: string
  sources: Source[]
}

export interface UploadResponse {
  success: boolean
  document_id: string
  filename: string
  chunks: number
  total_chunks: number
  message: string
}

export interface PineconeMetadata {
  document_id: string
  document_title: string
  source_type: string
  upload_date: string
  chunk_index: number
  chunk_text: string
  total_chunks: number
  file_type?: string
  file_size?: number
} 