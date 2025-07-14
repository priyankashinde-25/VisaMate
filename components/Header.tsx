'use client'

import { Upload, MessageCircle, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">VisaMate</span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link 
              href="/upload" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Documents</span>
            </Link>
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-primary-600 font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 