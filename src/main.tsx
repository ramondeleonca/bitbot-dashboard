import React from 'react'
import ReactDOM from 'react-dom/client'
import "./global.scss"
import App from './App'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='theme'>
      <App></App>
      <Toaster></Toaster>
    </ThemeProvider>
  </React.StrictMode>
)
