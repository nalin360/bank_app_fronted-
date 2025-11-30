import { Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import CreateAccountPage from './pages/CreateAccountPage';
import TransactionPage from './pages/TransactionPage';
import TransferPage from './pages/TransferPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const HomePage = () =>
  <div className="hero min-h-[50vh] bg-base-200 rounded-lg mt-8">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">Secure Digital Banking</h1>
        <p className="py-6">Manage your finances anytime, anywhere. Login or Register to get started.</p>
        <Link to="/register" className="btn btn-primary">Get Started</Link>
      </div>
    </div>
  </div>;

const NotFoundPage = () =>
  <div className="alert alert-warning shadow-lg mt-10">
    <div>
      <span>404: Page Not Found!</span>
    </div>
  </div>;


function App() {
  return (

    <Routes>
      <Route element={<Layout />}>

        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/account/new" element={<CreateAccountPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />}/>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

    </Routes>
  );
}

export default App;