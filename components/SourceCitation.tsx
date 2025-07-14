'use client'

import { FileText, Calendar, Tag } from 'lucide-react'

interface Source {
  document_title: string
  source_type: string
  upload_date: string
  chunk_text: string
}

interface SourceCitationProps {
  source: Source
}

export default function SourceCitation({ source }: SourceCitationProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getSourceTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'USCIS_FAQ': 'USCIS FAQ',
      'USCIS_GUIDE': 'USCIS Guide',
      'EMBASSY_FAQ': 'Embassy FAQ',
      'POLICY_MANUAL': 'Policy Manual',
      'FORM_INSTRUCTIONS': 'Form Instructions',
      'GENERAL': 'General Document'
    }
    return typeMap[type] || type
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
      <div className="flex items-start space-x-2">
        <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">
            {source.document_title}
          </div>
          
          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Tag className="w-3 h-3" />
              <span>{getSourceTypeLabel(source.source_type)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Updated: {formatDate(source.upload_date)}</span>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-600 bg-white border border-gray-200 rounded p-2">
            <div className="font-medium mb-1">Relevant excerpt:</div>
            <div className="line-clamp-3">
              {source.chunk_text.length > 200 
                ? `${source.chunk_text.substring(0, 200)}...` 
                : source.chunk_text
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 