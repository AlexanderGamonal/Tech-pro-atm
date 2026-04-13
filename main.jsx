import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './src/App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Registra el Service Worker — auto-update silencioso
registerSW({
  onNeedRefresh() {
    // Nueva versión disponible — actualiza automáticamente
    console.log('[PWA] Nueva versión disponible, actualizando...')
  },
  onOfflineReady() {
    console.log('[PWA] App lista para uso offline')
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
