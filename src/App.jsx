
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage'; 
import LoginPage from './pages/LoginPage'; 
import ProtectedRoute from './components/ProtectedRoute'; 

const DashboardPage = () => <h1>Dashboard (Protected)</h1>;
const NotFoundPage = () => <h1>404 Not Found</h1>;


function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-4">  
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<h1>Home - Welcome to Banking App!</h1>} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/register" element={<RegisterPage />} /> 
          
          <Route element={<ProtectedRoute />}>
            {/* ONLY render if the user is authenticated */}
            <Route path="/dashboard" element={<DashboardPage />} /> 
         
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;