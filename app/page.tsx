'use client'

import { useState } from 'react'
import ChatInterface from '@/components/ChatInterface'
import Header from '@/components/Header'
import Disclaimer from '@/components/Disclaimer'

export default function Home() {
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(false)

  if (!isDisclaimerAccepted) {
    return (
      <Disclaimer onAccept={() => setIsDisclaimerAccepted(true)} />
    )
  }

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex flex-col">
        <ChatInterface />
      </div>
    </main>
  )
} 