import {createRoot} from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
// Import the interceptor to add JWT token to all fetch requests
import './services/Interceptor.ts'

createRoot(document.getElementById('root')!).render(
    <App/>
)
