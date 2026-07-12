import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_NAMES = {
  villager: 'Patient',
  ngo: 'Healthcare Provider',
  admin: 'Administrator'
};

function PermissionDenied({ role, targetRole }) {
  const targetName = ROLE_NAMES[targetRole] || targetRole;
  const roleName = ROLE_NAMES[role] || role;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Access Restricted</h1>
        <p className="text-base text-slate-500 font-medium mb-6 leading-relaxed">
          This area is for <strong className="text-slate-700">{targetName}</strong> users only.
          Your account is registered as <strong className="text-slate-700">{roleName}</strong>.
        </p>
        <a
          href={`/${role}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
        >
          Go to your Dashboard
        </a>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-[3px] border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-400 tracking-wider uppercase">Loading</p>
      </div>
    </div>
  );
}

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading, sessionExpired, idleExpired } = useAuth();

  if (loading) return <LoadingScreen />;

  if (sessionExpired) {
    return <Navigate to="/login?expired=session" replace />;
  }

  if (idleExpired) {
    return <Navigate to="/login?expired=idle" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole) {
    const roles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
    if (!roles.includes(user.role)) {
      if (user.role === 'admin' && !allowedRole.includes('admin') && !allowedRole.includes('villager')) {
        return <PermissionDenied role={user.role} targetRole={allowedRole} />;
      }
      const redirectMap = { villager: '/villager', ngo: '/ngo', admin: '/admin' };
      return <Navigate to={redirectMap[user.role] || '/'} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
