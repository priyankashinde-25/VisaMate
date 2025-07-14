'use client'

import { User, Bot } from 'lucide-react'
import SourceCitation from './SourceCitation'

interface Source {
  document_title: string
  source_type: string
  upload_date: string
  chunk_text: string
}

interface MessageProps {
  message: {
    role: 'user' | 'assistant'
    content: string
    sources?: Source[]
    timestamp: Date
  }
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-primary-600' : 'bg-gray-600'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        
        <div className={`flex flex-col space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-lg px-4 py-3 max-w-2xl ${
            isUser 
              ? 'bg-primary-600 text-white' 
              : 'bg-white border border-gray-200 text-gray-900'
          }`}>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
          
          {message.sources && message.sources.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-gray-500 font-medium">
                Sources:
              </div>
              <div className="space-y-1">
                {message.sources.map((source, index) => (
                  <SourceCitation key={index} source={source} />
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-400">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 