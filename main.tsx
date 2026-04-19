import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './src/App'
import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    console.log('[PWA] Nueva versión disponible, actualizando...')
  },
  onOfflineReady() {
    console.log('[PWA] App lista para uso offline')
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
