import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MembershipProvider } from './components/MembershipContext'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from '@material-tailwind/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MembershipProvider>
      <NextUIProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </NextUIProvider>
    </MembershipProvider>{' '}
  </React.StrictMode>
)
