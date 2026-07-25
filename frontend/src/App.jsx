import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { VoiceGuidanceProvider } from './context/VoiceGuidanceContext';
import DiSHAConsentModal from './components/DiSHAConsentModal';
import { useConsentGiven } from './utils/consent';

// 404 page
import NotFoundPage from './pages/NotFoundPage';

// Pages — critical path (eager loaded for instant auth routing)
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import IntroFlow from './pages/IntroFlow';
import RegisterPage from './pages/RegisterPage';
import DemoPage from './pages/DemoPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';

// Pages — heavy, lazy-loaded for Vercel edge performance & 2G optimization
const VillagerDashboard  = lazy(() => import('./Villager/VillagerDashboard'));
const NGODashboard       = lazy(() => import('./NGO/NGODashboard'));
const ASHADashboard      = lazy(() => import('./NGO/ASHADashboard'));
const AdminDashboard     = lazy(() => import('./Admin/AdminDashboard'));
const SymptomCheckerPage     = lazy(() => import('./pages/SymptomCheckerPage'));
const SkinDiseaseCheckerPage = lazy(() => import('./pages/SkinDiseaseCheckerPage'));
const AmbulancePage          = lazy(() => import('./pages/AmbulancePage'));
const UserProfile            = lazy(() => import('./pages/UserProfile'));
const MenstrualHealth        = lazy(() => import('./pages/MenstrualHealth'));
const MaternalHealthPage     = lazy(() => import('./pages/MaternalHealthPage'));
const ChildNutritionPage     = lazy(() => import('./pages/ChildNutritionPage'));
const GovernmentSchemesPage  = lazy(() => import('./pages/GovernmentSchemesPage'));
const SchemeDetailPage        = lazy(() => import('./pages/SchemeDetailPage'));
const MonitoringDashboard    = lazy(() => import('./pages/MonitoringDashboard'));
const NGOAlertsPage          = lazy(() => import('./pages/NGOAlertsPage'));
const NGOPatientRegistryPage = lazy(() => import('./pages/NGOPatientRegistryPage'));
const NGORecordCreationPage  = lazy(() => import('./pages/NGORecordCreationPage'));

// MediFlow AI Multi-Agent Pages
const PatientTimeline        = lazy(() => import('./pages/PatientTimeline'));
const MedicalRecordsPage     = lazy(() => import('./pages/MedicalRecordsPage'));
const CareCoordinationPage   = lazy(() => import('./pages/CareCoordinationPage'));
const MedicationSafetyPage   = lazy(() => import('./pages/MedicationSafetyPage'));
const HospitalRecommendPage  = lazy(() => import('./pages/HospitalRecommendPage'));
const AppointmentPage        = lazy(() => import('./pages/AppointmentPage'));
const DoctorDashboard        = lazy(() => import('./pages/DoctorDashboard'));

// Components
import Footer from './components/Footer';
import OfflineToast from './components/OfflineToast';
import ErrorBoundary from './components/ErrorBoundary';
import DesktopOnlyWrapper from './components/DesktopOnlyWrapper';

// Skeleton loader shown while lazy chunks download
function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh', background: '#f8fafc',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #e2e8f0',
          borderTopColor: '#10b981', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
        }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em' }}>LOADING…</p>
      </div>
    </div>
  );
}

// Protected Route wrapper to ensure only authorized users access roles
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading, sessionExpired, idleExpired } = useAuth();
  if (loading) return <PageLoader />;
  if (sessionExpired) return <Navigate to="/login?expired=session" replace />;
  if (idleExpired) return <Navigate to="/login?expired=idle" replace />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole) {
    const roles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
    if (!roles.includes(user.role)) {
      const redirectMap = { villager: '/villager', ngo: '/ngo', admin: '/admin' };
      return <Navigate to={redirectMap[user.role] || '/'} replace />;
    }
  }
  return children;
};

// Animated page wrapper for route transitions
function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// Routes wrapped with AnimatePresence for page transitions
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<AnimatedPage><IntroFlow /></AnimatedPage>} />
          <Route path="/intro" element={<AnimatedPage><IntroFlow /></AnimatedPage>} />
          <Route path="/demo" element={<AnimatedPage><DemoPage /></AnimatedPage>} />
          <Route path="/pricing" element={<AnimatedPage><LayoutWrapper><PricingPage /></LayoutWrapper></AnimatedPage>} />
          <Route path="/about" element={<AnimatedPage><LayoutWrapper><AboutPage /></LayoutWrapper></AnimatedPage>} />
          <Route path="/contact" element={<AnimatedPage><LayoutWrapper><ContactPage /></LayoutWrapper></AnimatedPage>} />
          <Route path="/privacy" element={<AnimatedPage><LayoutWrapper><PrivacyPage /></LayoutWrapper></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
          <Route path="/register" element={<AnimatedPage><RegisterPage /></AnimatedPage>} />
          <Route path="/home" element={<AnimatedPage><ProtectedRoute><LayoutWrapper><ErrorBoundary><LandingPage /></ErrorBoundary></LayoutWrapper></ProtectedRoute></AnimatedPage>} />
          <Route path="/villager" element={<AnimatedPage><ProtectedRoute allowedRole="villager"><LayoutWrapper><ErrorBoundary><VillagerDashboard /></ErrorBoundary></LayoutWrapper></ProtectedRoute></AnimatedPage>} />
          <Route path="/symptoms" element={<AnimatedPage><ProtectedRoute allowedRole="villager"><LayoutWrapper><ErrorBoundary><SymptomCheckerPage /></ErrorBoundary></LayoutWrapper></ProtectedRoute></AnimatedPage>} />
          <Route path="/skin-disease" element={<AnimatedPage><ProtectedRoute allowedRole={["villager", "ngo"]}><LayoutWrapper><ErrorBoundary><SkinDiseaseCheckerPage /></ErrorBoundary></LayoutWrapper></ProtectedRoute></AnimatedPage>} />
          <Route path="/ambulance" element={<AnimatedPage><ProtectedRoute allowedRole="villager"><LayoutWrapper><ErrorBoundary><AmbulancePage /></ErrorBoundary></LayoutWrapper></ProtectedRoute></AnimatedPage>} />
          <Route path="/profile" element={<AnimatedPage><ProtectedRoute><LayoutWrapper><ErrorBoundary><UserProfile /></ErrorBoundary></LayoutWrapper></ProtectedRoute></AnimatedPage>} />
          <Route path="/menstrual-health" element={<AnimatedPage><ProtectedRoute allowedRole="villager"><LayoutWrapper><ErrorBoundary><MenstrualHealth /></ErrorBoundary></LayoutWrapper></ProtectedRoute></AnimatedPage>} />
          <Route path="/schemes" element={<AnimatedPage><ProtectedRoute allowedRole="villager"><LayoutWrapper><ErrorBoundary><GovernmentSchemesPage /></ErrorBoundary></LayoutWrapper></ProtectedRoute></AnimatedPage>} />
          <Route path="/schemes/:id" element={<AnimatedPage><ProtectedRoute allowedRole="villager"><LayoutWrapper><ErrorBoundary><SchemeDetailPage /></ErrorBoundary></LayoutWrapper></ProtectedRoute></AnimatedPage>} />
          <Route path="/asha" element={<AnimatedPage><ProtectedRoute allowedRole={["ngo", "admin"]}><ErrorBoundary><ASHADashboard /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/ngo" element={<AnimatedPage><ProtectedRoute allowedRole="ngo"><ErrorBoundary><NGODashboard /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/ngo/maternal" element={<AnimatedPage><ProtectedRoute allowedRole="ngo"><ErrorBoundary><MaternalHealthPage /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/ngo/alerts" element={<AnimatedPage><ProtectedRoute allowedRole="ngo"><ErrorBoundary><NGOAlertsPage /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/ngo/patients" element={<AnimatedPage><ProtectedRoute allowedRole="ngo"><ErrorBoundary><NGOPatientRegistryPage /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/ngo/records" element={<AnimatedPage><ProtectedRoute allowedRole="ngo"><ErrorBoundary><NGORecordCreationPage /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/ngo/child-nutrition" element={<AnimatedPage><ProtectedRoute allowedRole="ngo"><ErrorBoundary><ChildNutritionPage /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/admin" element={<AnimatedPage><ProtectedRoute allowedRole="admin"><DesktopOnlyWrapper dashboardName="Admin Command Center"><ErrorBoundary><AdminDashboard /></ErrorBoundary></DesktopOnlyWrapper></ProtectedRoute></AnimatedPage>} />
          <Route path="/monitor" element={<AnimatedPage><ProtectedRoute allowedRole={["admin", "ngo", "villager"]}><DesktopOnlyWrapper dashboardName="District Simulation & Observability Monitor"><LayoutWrapper><ErrorBoundary><MonitoringDashboard /></ErrorBoundary></LayoutWrapper></DesktopOnlyWrapper></ProtectedRoute></AnimatedPage>} />
          <Route path="/timeline" element={<AnimatedPage><ProtectedRoute><ErrorBoundary><PatientTimeline /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/records" element={<AnimatedPage><ProtectedRoute><ErrorBoundary><MedicalRecordsPage /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/care-coordination" element={<AnimatedPage><ProtectedRoute allowedRole={["ngo", "admin"]}><ErrorBoundary><CareCoordinationPage /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/medication-safety" element={<AnimatedPage><ProtectedRoute><ErrorBoundary><MedicationSafetyPage /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/hospital-recommend" element={<AnimatedPage><ProtectedRoute><ErrorBoundary><HospitalRecommendPage /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/appointments" element={<AnimatedPage><ProtectedRoute><ErrorBoundary><AppointmentPage /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="/doctor-copilot" element={<AnimatedPage><ProtectedRoute allowedRole={["ngo", "admin"]}><ErrorBoundary><DoctorDashboard /></ErrorBoundary></ProtectedRoute></AnimatedPage>} />
          <Route path="*" element={<AnimatedPage><NotFoundPage /></AnimatedPage>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// Shows DISHA consent modal once per device after first login (restricted to villagers, tracked per user)
function ConsentGate({ children }) {
  const { user } = useAuth();
  
  const getConsentKey = (u) => {
    if (!u) return null;
    return `mediflow_disha_consent_${u.id || u.username || u.phone || 'guest'}`;
  };

  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'villager') {
        setConsented(localStorage.getItem(getConsentKey(user)) === 'true');
      } else {
        // Non-villagers do not need DISHA consent modal
        setConsented(true);
      }
    } else {
      setConsented(false);
    }
  }, [user]);

  const handleConsent = () => {
    if (user) {
      localStorage.setItem(getConsentKey(user), 'true');
      setConsented(true);
    }
  };

  const needsConsent = user && user.role === 'villager' && !consented;

  return (
    <>
      {children}
      <AnimatePresence>
        {needsConsent && (
          <DiSHAConsentModal onConsent={handleConsent} />
        )}
      </AnimatePresence>
    </>
  );
}

// Layout wrapper to include footer on all pages
const LayoutWrapper = ({ children }) => (
  <>
    {children}
    <Footer />
  </>
);

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ConsentGate>
        <Router>
          <div className="font-inter">
            <VoiceGuidanceProvider>
            <Suspense fallback={<PageLoader />}>
            <ErrorBoundary>
            <AnimatedRoutes />
            </ErrorBoundary>
            </Suspense>
            </VoiceGuidanceProvider>
            {/* YouTube-style offline toast — appears on every page when data cuts */}
            <OfflineToast />
          </div>
        </Router>
        </ConsentGate>
      </AuthProvider>
    </LanguageProvider>
  );
}
