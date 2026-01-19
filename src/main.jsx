import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// importar favicon desde src/assets
const favicon = import.meta.env.VITE_FAVICON_URL

// crear y agregar el link del favicon al head
const link = document.createElement('link')
link.rel = 'icon'
link.type = 'image/png'
link.href = favicon
document.head.appendChild(link)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
