import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{background: '#A4C2FA', backgroundSize: "cover"}}>
      <App />
    </div>
  </React.StrictMode>
)
//Relevant code inspired byhttps://www.geeksforgeeks.org/reactjs/how-to-set-background-images-in-reactjs/
//Background image looked awful so I took the hex code and reapplied it
