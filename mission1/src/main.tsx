import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ContextPage } from './ContextPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContextPage>
      <App />
    </ContextPage>
  </StrictMode>,
)
