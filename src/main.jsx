import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './Redux/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />

        <Toaster
          position='top-right'
          reverseOrder={false}
          gutter={10}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#202E38',
              color: '#E6EDF2',
              border: '1px solid #33434E',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px'
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#36B6A0',
                secondary: '#202E38'
              }
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#202E38'
              }
            }
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
