'use client'
import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch((err) => console.error('SW registration failed:', err))
    }
  }, [])

  return (
    <div>
      <h1>Next.js PWA Test</h1>
      <p>Abra este site em um dispositivo móvel e veja se aparece a opção "Adicionar à tela inicial".</p>
    </div>
  )
}