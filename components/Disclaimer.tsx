'use client'

import { AlertTriangle, CheckCircle } from 'lucide-react'

interface DisclaimerProps {
  onAccept: () => void
}

export default function Disclaimer({ onAccept }: DisclaimerProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Important Disclaimer
            </h1>
            <p className="text-gray-600">
              Please read this disclaimer carefully before using VisaMate
            </p>
          </div>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Not Legal Advice
              </h3>
              <p className="text-yellow-700">
                VisaMate provides information based on official sources but does not constitute legal advice. 
                Immigration laws are complex and constantly changing. Always consult with a qualified immigration 
                attorney for your specific situation.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                📋 Information Sources
              </h3>
              <p className="text-blue-700">
                Our responses are based on official USCIS documentation, embassy guidelines, and other 
                authoritative sources. We cite our sources and indicate when information may be incomplete.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">
                🔒 Privacy & Security
              </h3>
              <p className="text-green-700">
                Your conversations are processed securely. We do not store personal information or 
                immigration details. All data is encrypted and handled according to privacy best practices.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                📝 How to Use
              </h3>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Ask specific questions about visa processes, requirements, or procedures</li>
                <li>Upload relevant documents to get more accurate, contextual answers</li>
                <li>Always verify information with official sources or legal professionals</li>
                <li>Use this tool as a starting point for your research, not as final advice</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onAccept}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <CheckCircle className="w-5 h-5" />
              <span>I Understand and Accept</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By clicking "I Understand and Accept", you acknowledge that you have read and 
              understood this disclaimer and agree to use VisaMate responsibly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 