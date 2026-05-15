/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Loader2 } from 'lucide-react';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import DashboardClient from './pages/DashboardClient';
import DashboardFreelancer from './pages/DashboardFreelancer';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'client' | 'freelancer' }) {
  const { user, profile, isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!profile) {
    return <Navigate to="/onboarding" />;
  }

  if (role && profile.role !== role && profile.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          
          {/* Client Routes */}
          <Route path="/client" element={<ProtectedRoute role="client"><DashboardClient /></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute role="client"><PostJob /></ProtectedRoute>} />
          
          {/* Freelancer Routes */}
          <Route path="/freelancer" element={<ProtectedRoute role="freelancer"><DashboardFreelancer /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}