import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import ForcePasswordChangeModal from './components/ForcePasswordChangeModal';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ForcePasswordChangeModal />
      </AuthProvider>
    </BrowserRouter>
  );
}
