import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/scss/reset.scss';
import '@/assets/scss/base.scss';
import '@/assets/scss/common.scss';
import '@/assets/scss/layout.scss';
import App from '@/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
