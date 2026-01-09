import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'

import { AuthProvider } from './context/AuthContext.jsx'
import { ScreenTimeProvider } from './context/ScreenTimeContext.jsx'
import { CompletionsProvider } from './context/CompletionsContext.jsx'
import { TaskProvider } from './context/TaskContext.jsx'  // if you made this

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <TaskProvider>         
          <CompletionsProvider>
            <ScreenTimeProvider>
              <App />
            </ScreenTimeProvider>
          </CompletionsProvider>
        </TaskProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>
)
