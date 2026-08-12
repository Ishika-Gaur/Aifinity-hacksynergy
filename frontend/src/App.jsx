import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import AssessmentPage from './pages/AssessmentPage';
import AssessmentAttemptPage from './pages/AssessmentAttemptPage';
import Dashboard from './pages/Dashboard';
import ConceptRoot from './pages/ConceptRoot';
import MistakeMap from './pages/MistakeMap';
import SkillGap from './pages/SkillGap';
import Roadmap from './pages/Roadmap';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import OnboardingPage from './pages/OnboardingPage';
import ForgotPassword from './pages/ForgotPassword';

// Admin Auth & Protection
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Admin Auth Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';

// Admin Dashboard
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import UserManagement from './pages/admin/UserManagement';
import AiAnalytics from './pages/admin/AiAnalytics';
import ContentManagement from './pages/admin/ContentManagement';
import ReportsPage from './pages/admin/ReportsPage';
import AdminSettings from './pages/admin/AdminSettings';

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>

          {/* =====================================================
              ADMIN AUTH ROUTES
              ===================================================== */}

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />


          {/* =====================================================
              PROTECTED ADMIN DASHBOARD
              ===================================================== */}

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>

              <Route index element={<AdminOverview />} />

              <Route path="dashboard" element={<AdminOverview />} />

              <Route path="users" element={<UserManagement />} />

              <Route path="analytics" element={<AiAnalytics />} />

              <Route path="content" element={<ContentManagement />} />

              <Route path="reports" element={<ReportsPage />} />

              <Route path="settings" element={<AdminSettings />} />

            </Route>
          </Route>


          {/* =====================================================
              PUBLIC WEBSITE
              ===================================================== */}

          <Route element={<PublicLayout />}>

            <Route path="/" element={<Home />} />

            <Route path="/about" element={<About />} />

            <Route path="/assessment" element={<AssessmentPage />} />

            <Route
              path="/assessment/:id"
              element={<AssessmentAttemptPage />}
            />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/concept-root" element={<ConceptRoot />} />

            <Route path="/conceptroot" element={<ConceptRoot />} />

            <Route path="/mistake-map" element={<MistakeMap />} />

            <Route path="/skill-gap" element={<SkillGap />} />

            <Route path="/roadmap" element={<Roadmap />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route
              path="/onboardingpage"
              element={<OnboardingPage />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            <Route path="*" element={<NotFound />} />

          </Route>

        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;