import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{background: '#A4C2FA', minHeight: '100vh'}}>
      <App />
    </div>
  </React.StrictMode>
)
