'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface UploadStatus {
  id: string
  filename: string
  status: 'uploading' | 'processing' | 'success' | 'error'
  message?: string
}

export default function UploadPage() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true)
    
    for (const file of acceptedFiles) {
      const statusId = Date.now().toString()
      
      // Add initial status
      setUploadStatus(prev => [...prev, {
        id: statusId,
        filename: file.name,
        status: 'uploading'
      }])

      try {
        const formData = new FormData()
        formData.append('file', file)

        // Update to processing
        setUploadStatus(prev => prev.map(s => 
          s.id === statusId ? { ...s, status: 'processing' } : s
        ))
        console.log('check formData', formData)
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        })
        console.log(response)
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }

        const result = await response.json()

        // Update to success
        setUploadStatus(prev => prev.map(s => 
          s.id === statusId ? { 
            ...s, 
            status: 'success',
            message: `Processed ${result.chunks} chunks successfully`
          } : s
        ))

      } catch (error) {
        console.error('Upload error:', error)
        
        // Update to error
        setUploadStatus(prev => prev.map(s => 
          s.id === statusId ? { 
            ...s, 
            status: 'error',
            message: error instanceof Error ? error.message : 'Upload failed'
          } : s
        ))
      }
    }
    
    setIsProcessing(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    multiple: true,
    disabled: isProcessing
  })

  const getStatusIcon = (status: UploadStatus['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Documents
          </h1>
          <p className="text-gray-600">
            Upload immigration documents to enhance VisaMate's knowledge base. 
            Supported formats: PDF and TXT files.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <div className="card">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragActive 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-400'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <input {...getInputProps()} />
                
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                
                {isDragActive ? (
                  <p className="text-primary-600 font-medium">
                    Drop the files here...
                  </p>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drag & drop files here
                    </p>
                    <p className="text-gray-500 mb-4">
                      or click to select files
                    </p>
                    <p className="text-sm text-gray-400">
                      Supports PDF and TXT files up to 10MB each
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upload Status */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Status
              </h3>
              
              {uploadStatus.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No uploads yet. Drag and drop files to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {uploadStatus.map((status) => (
                    <div key={status.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getStatusIcon(status.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {status.filename}
                        </p>
                        {status.message && (
                          <p className="text-xs text-gray-500">
                            {status.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recommended Documents
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">H-1B Documents</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• USCIS H-1B FAQ</li>
                  <li>• H-1B Transfer Guidelines</li>
                  <li>• H-1B Extension Procedures</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">F-1/OPT Documents</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• USCIS F-1 FAQ</li>
                  <li>• OPT Application Guide</li>
                  <li>• STEM OPT Extension Info</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Important Note:</p>
                  <p>
                    Only upload official documents from trusted sources like USCIS, 
                    embassies, or government agencies. This ensures accurate and 
                    reliable information for users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 