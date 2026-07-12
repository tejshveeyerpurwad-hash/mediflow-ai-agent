import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import api from '../services/api';
import villagerService from '../services/villagerService';
import ngoService from '../services/ngoService';
import adminService from '../services/adminService';

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_CHECK_INTERVAL = 60 * 1000;

function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j;
  var result = '';
  var words = [];
  var asciiLength = ascii[lengthProperty] * 8;
  var hash = [];
  var k = [];
  var primeCounter = 0;
  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = 1;
      }
      if (primeCounter < 8) {
        hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      }
      k[primeCounter] = (mathPow(candidate, 1/3) * maxWord) | 0;
      primeCounter++;
    }
  }
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) {
    ascii += '\x00';
  }
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << ((3 - i % 4) * 8);
  }
  words[words[lengthProperty]] = ((asciiLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiLength | 0);
  for (j = 0; j < words[lengthProperty];) {
    var w = words.slice(j, j += 16);
    var oldHash = hash.slice(0);
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      var wItem = w[i];
      if (i >= 16) {
        var s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        var s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        wItem = w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      var maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      var sigma0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      var sigma1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      var temp1 = (hash[7] + sigma1 + ch + k[i] + wItem) | 0;
      var temp2 = (sigma0 + maj) | 0;
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

const AuthContext = createContext(null);
const DEMO_SECRET = 'Demo@1234';
const demoCredentialHash = (identifier, role, secret = DEMO_SECRET) => sha256(`${identifier}:${role}:${secret}`);

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function cleanUserObject(userObj) {
  if (!userObj) return userObj;
  const next = { ...userObj };
  if (next.name) {
    next.name = next.name
      .replace(/\(Demo\s+Villager\)/gi, '')
      .replace(/\(Demo\s+ASHA\s+Worker\)/gi, '')
      .replace(/\(Demo\s+ASHA\)/gi, '')
      .replace(/\(Demo\s+Admin\)/gi, '')
      .trim();
    if (next.name === 'Demo Villager') next.name = 'Ramesh Singh';
    if (next.name === 'Demo ASHA') next.name = 'Anjali Sharma';
    if (next.name === 'Demo Admin') next.name = 'District Administrator';
  }
  return next;
}

function normalizeOfflineUsers(users) {
  return (Array.isArray(users) ? users : []).map(user => {
    const identifier = user.email || user.phone || user.username || user.id;
    const next = { ...user };
    if (!next.credentialHash && next.password && identifier && next.role) {
      next.credentialHash = demoCredentialHash(identifier, next.role, next.password);
    }
    delete next.password;
    return cleanUserObject(next);
  });
}

export const AuthProvider = ({ children }) => {
  const [user, _setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [idleExpired, setIdleExpired] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const sessionStartRef = useRef(null);

  const setUser = (val) => {
    _setUser(typeof val === 'function' ? (prev) => cleanUserObject(val(prev)) : cleanUserObject(val));
  };

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('swasthai_session_start');
    localStorage.removeItem('swasthai_session_id');
    _setUser(null);
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const recordActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    const handleActivity = () => recordActivity();
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('scroll', handleActivity, { passive: true });
    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [recordActivity]);

  useEffect(() => {
    try {
      const offlineUsers = normalizeOfflineUsers(JSON.parse(localStorage.getItem('swasthai_offline_user_cache') || '[]'));
      const defaultDemoUsers = [
        { id: 'demo-villager', name: 'Ramesh Singh', username: '9876543210', email: '', phone: '9876543210', credentialHash: demoCredentialHash('9876543210', 'villager'), role: 'villager', villageId: 'v101', isOfflineSession: true },
        { id: 'demo-ngo', name: 'Anjali Sharma', username: '9876543211', email: '', phone: '9876543211', credentialHash: demoCredentialHash('9876543211', 'ngo'), role: 'ngo', villageId: 'v101', isOfflineSession: true },
        { id: 'demo-admin', name: 'District Administrator', username: 'admin', email: 'admin@swasthai.in', phone: '', credentialHash: demoCredentialHash('admin@swasthai.in', 'admin'), role: 'admin', villageId: 'v101', isOfflineSession: true }
      ];
      let updated = [...offlineUsers];
      defaultDemoUsers.forEach(demoUser => {
        const existingIndex = updated.findIndex(u =>
          u.username === demoUser.username ||
          (demoUser.email && u.email === demoUser.email) ||
          (demoUser.phone && u.phone === demoUser.phone)
        );
        if (existingIndex >= 0) {
          updated[existingIndex] = { ...updated[existingIndex], ...demoUser };
        } else {
          updated.push(demoUser);
        }
      });
      localStorage.setItem('swasthai_offline_user_cache', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to seed offline database:', e);
    }

    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const sessionStart = localStorage.getItem('swasthai_session_start');

      if (token && savedUser) {
        if (sessionStart) {
          const elapsed = Date.now() - parseInt(sessionStart, 10);
          if (elapsed > SESSION_DURATION_MS) {
            clearSession();
            setSessionExpired(true);
            setLoading(false);
            return;
          }
          sessionStartRef.current = parseInt(sessionStart, 10);
        } else {
          sessionStartRef.current = Date.now();
          localStorage.setItem('swasthai_session_start', String(sessionStartRef.current));
        }
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('swasthai_session_start');
      localStorage.removeItem('swasthai_session_id');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed > IDLE_TIMEOUT_MS) {
        setIdleExpired(true);
        logout();
        clearInterval(interval);
      }
    }, SESSION_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [user, logout]);

  const services = useMemo(() => {
    if (!user) return {};
    switch (user.role) {
      case 'villager': return { villager: villagerService };
      case 'ngo': return { ngo: ngoService };
      case 'admin': return { admin: adminService };
      default: return {};
    }
  }, [user]);

  const cacheUserOffline = (data) => {
    try {
      const offlineUsers = JSON.parse(localStorage.getItem('swasthai_offline_user_cache') || '[]');
      const newUser = {
        id: 'cached-user-' + Date.now(),
        name: data.name,
        username: data.username,
        email: data.email || '',
        phone: data.phone || '',
        credentialHash: demoCredentialHash(data.email || data.phone || data.username, data.role || 'villager', data.password),
        role: data.role || 'villager',
        villageId: data.villageId || 'v101',
        isOfflineSession: true
      };
      const filtered = offlineUsers.filter(u =>
        u.username !== data.username &&
        (data.phone ? u.phone !== data.phone : true) &&
        (data.email ? u.email !== data.email : true)
      );
      filtered.push(newUser);
      localStorage.setItem('swasthai_offline_user_cache', JSON.stringify(filtered));
      return newUser;
    } catch (e) {
      console.error('Error caching user offline:', e);
      return null;
    }
  };

  const register = async (data) => {
    const cachedUser = cacheUserOffline(data);
    if (!navigator.onLine) {
      return { success: true, message: 'Offline registration successful. Sync pending.', user: cachedUser };
    }
    try {
      const res = await api.post('/auth/register', data);
      return res.data;
    } catch (error) {
      const isNetworkOrServerError =
        !error.response ||
        error.code === 'ECONNABORTED' ||
        (error.response && error.response.status >= 500);
      if (isNetworkOrServerError) {
        return { success: true, message: 'No network. Registered locally.', user: cachedUser };
      }
      throw error;
    }
  };

  const loginPassword = async (identifier, password, role) => {
    const createSession = (matchedUser) => {
      const sessionId = generateSessionId();
      localStorage.setItem('token', 'session_' + sessionId);
      localStorage.setItem('user', JSON.stringify(matchedUser));
      const now = Date.now();
      localStorage.setItem('swasthai_session_start', String(now));
      localStorage.setItem('swasthai_session_id', sessionId);
      sessionStartRef.current = now;
      lastActivityRef.current = now;
      setUser(matchedUser);
      return matchedUser;
    };

    const createOfflineSession = () => {
      try {
        const offlineUsers = JSON.parse(localStorage.getItem('swasthai_offline_user_cache') || '[]');
        const matchedUser = offlineUsers.find(u =>
          (u.email && u.email.toLowerCase() === identifier.toLowerCase()) ||
          (u.phone && u.phone === identifier) ||
          (u.username && u.username.toLowerCase() === identifier.toLowerCase())
        );
        if (matchedUser) {
          const matchedIdentifier = matchedUser.email || matchedUser.phone || matchedUser.username;
          if (matchedUser.credentialHash !== demoCredentialHash(matchedIdentifier, matchedUser.role, password)) {
            throw new Error('Incorrect password.');
          }
          if (matchedUser.role !== role) {
            throw new Error(`This account is registered as '${matchedUser.role}', not '${role}'.`);
          }
          return createSession(matchedUser);
        }
      } catch (e) {
        if (e.message && (e.message.includes('Incorrect password') || e.message.includes('registered as'))) throw e;
        console.error('Error reading offline cache:', e);
      }
      throw new Error('No account found. Please connect to the internet to log in for the first time.');
    };

    if (!navigator.onLine && identifier && password) return createOfflineSession();

    try {
      const res = await api.post('/auth/login-password', { identifier, email: identifier, phone: identifier, password, role });
      const sessionId = generateSessionId();
      localStorage.setItem('token', res.data.token || 'session_' + sessionId);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const now = Date.now();
      localStorage.setItem('swasthai_session_start', String(now));
      localStorage.setItem('swasthai_session_id', sessionId);
      sessionStartRef.current = now;
      lastActivityRef.current = now;
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      const isNetworkOrServerError =
        !error.response ||
        error.code === 'ECONNABORTED' ||
        (error.response && error.response.status >= 500);
      if (isNetworkOrServerError && identifier && password) {
        return createOfflineSession();
      }
      const msg = error.response?.data?.error || error.message || 'Login failed. Please try again.';
      throw new Error(msg);
    }
  };

  const loginOTP = async (phone, otp, role) => {
    const createOTPSession = (matchedUser) => {
      const sessionId = generateSessionId();
      localStorage.setItem('token', 'session_' + sessionId);
      localStorage.setItem('user', JSON.stringify(matchedUser));
      const now = Date.now();
      localStorage.setItem('swasthai_session_start', String(now));
      localStorage.setItem('swasthai_session_id', sessionId);
      sessionStartRef.current = now;
      lastActivityRef.current = now;
      setUser(matchedUser);
      return matchedUser;
    };

    const createOfflineOTPSession = () => {
      try {
        const offlineUsers = JSON.parse(localStorage.getItem('swasthai_offline_user_cache') || '[]');
        const matchedUser = offlineUsers.find(u => u.phone === phone && u.role === role);
        if (matchedUser) {
          return createOTPSession(matchedUser);
        }
      } catch (e) {
        console.error('Error reading offline cache:', e);
      }
      throw new Error('No account found for this phone number. Please connect to the internet to log in for the first time.');
    };

    if (!navigator.onLine && phone && otp) {
      const isDevDemoOtp = import.meta.env.DEV && otp === '1234';
      if (!isDevDemoOtp) {
        throw new Error('Offline OTP login is only available in development with demo OTP 1234 for cached accounts.');
      }
      return createOfflineOTPSession();
    }

    try {
      const res = await api.post('/auth/login-otp', { phone, otp, role });
      const sessionId = generateSessionId();
      localStorage.setItem('token', res.data.token || 'session_' + sessionId);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const now = Date.now();
      localStorage.setItem('swasthai_session_start', String(now));
      localStorage.setItem('swasthai_session_id', sessionId);
      sessionStartRef.current = now;
      lastActivityRef.current = now;
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      const isNetworkOrServerError =
        !error.response ||
        error.code === 'ECONNABORTED' ||
        (error.response && error.response.status >= 500);
      if (isNetworkOrServerError && phone && otp && import.meta.env.DEV && otp === '1234') {
        return createOfflineOTPSession();
      }
      throw error.response?.data?.error || error.message || 'OTP login failed. Please try again.';
    }
  };

  const requestOTP = async (phone) => {
    if (!navigator.onLine) {
      return {
        message: import.meta.env.DEV
          ? 'Offline: use OTP 1234 only for accounts already cached on this device.'
          : 'No network. Connect once to request a real OTP.',
      };
    }
    try {
      const res = await api.post('/auth/request-otp', { phone });
      return res.data;
    } catch (error) {
      if (!error.response) {
        return {
          message: import.meta.env.DEV
            ? 'Network offline: demo OTP 1234 works for cached accounts only.'
            : 'Network offline. Connect to request OTP.',
        };
      }
      throw error.response?.data?.error || 'OTP request failed. Please try again.';
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      console.warn('Backend profile update failed:', error);
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    }
  };

  const dismissSessionExpiry = () => setSessionExpired(false);
  const dismissIdleExpiry = () => setIdleExpired(false);

  return (
    <AuthContext.Provider value={{
      user, setUser, register, loginPassword, loginOTP, requestOTP,
      updateProfile, logout, loading, services,
      sessionExpired, idleExpired, dismissSessionExpiry, dismissIdleExpiry
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
