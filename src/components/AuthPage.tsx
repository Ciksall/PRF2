import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User as UserIcon,
  Building2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { MediaPrimaLogo } from './MediaPrimaLogo';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogleAuth,
  UserProfile,
  UserRole,
} from '../services/firebase';

interface AuthPageProps {
  onAuthSuccess: (profile: UserProfile) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up State
  const [name, setName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [dept, setDept] = useState('HUMAN RESOURCES');
  const [role, setRole] = useState<'staff' | 'superior' | 'manager' | 'hod'>('staff');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Preset demo accounts for instant switching
  const handleQuickDemoFill = (demoRole: 'staff' | 'manager' | 'hod') => {
    if (demoRole === 'staff') {
      setLoginEmail('salmah@mediaprima.com.my');
      setLoginPassword('Password123!');
    } else if (demoRole === 'manager') {
      setLoginEmail('norintan@mediaprima.com.my');
      setLoginPassword('Password123!');
    } else if (demoRole === 'hod') {
      setLoginEmail('dona.zawina@mediaprima.com.my');
      setLoginPassword('Password123!');
    }
    setMode('signin');
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const profile = await signInWithEmail(loginEmail, loginPassword);
      onAuthSuccess(profile);
    } catch (err: any) {
      console.error('Sign in error:', err);
      let msg = 'Sign in failed. Please verify your email and password.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Incorrect email or password. Please try again or create a new account.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/password sign-in is not enabled. Please use "Sign in with Google" below.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const profile = await signUpWithEmail(
        signupEmail,
        signupPassword,
        name,
        role as UserRole,
        dept,
        staffId
      );
      onAuthSuccess(profile);
    } catch (err: any) {
      console.error('Sign up error:', err);
      let msg = 'Failed to register account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in or use another email.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email registration is not enabled. Please use "Sign in with Google".';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const { profile } = await signInWithGoogleAuth();
      onAuthSuccess(profile);
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err.message || 'Google sign in was unsuccessful.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-red-500 selection:text-white">
      {/* Container */}
      <div className="max-w-md w-full">
        {/* Brand Card Top */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden mb-6">
          <div className="bg-[#191C21] p-6 text-center border-b border-slate-800">
            <div className="inline-block p-1 bg-white rounded-lg shadow-md mb-3">
              <MediaPrimaLogo onWhiteBackground={false} />
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Payment Requisition Form Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Integrated PRF Verification & Executive Approval System
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3.5 flex items-center justify-center gap-2 border-b-2 transition ${
                mode === 'signin'
                  ? 'border-[#ED1C24] text-[#ED1C24] bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3.5 flex items-center justify-center gap-2 border-b-2 transition ${
                mode === 'signup'
                  ? 'border-[#ED1C24] text-[#ED1C24] bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
          </div>

          <div className="p-6">
            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Google Fast Sign In */}
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-slate-300 rounded-xl bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition shadow-xs disabled:opacity-50 active:scale-[0.99]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.41l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                  <span className="bg-white px-2">or continue with Media Prima email</span>
                </div>
              </div>
            </div>

            {/* Mode: Sign In */}
            {mode === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@mediaprima.com.my"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#ED1C24] hover:bg-[#d9161d] text-white text-xs font-bold rounded-lg shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Mode: Sign Up */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Salmah Binti Alimuddin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Staff ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MP-5524"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Portal Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition bg-white"
                    >
                      <option value="staff">Staff / Requester</option>
                      <option value="superior">Superior / Manager (Verifier)</option>
                      <option value="hod">HOD (Approver)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Division / Department
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. HUMAN RESOURCES"
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@mediaprima.com.my"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#ED1C24] hover:bg-[#d9161d] text-white text-xs font-bold rounded-lg shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99] mt-2"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Register Account & Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Accounts */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Quick Demo Profiles:</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('staff')}
                  className="p-2 border border-slate-200 rounded-lg text-left hover:border-red-300 hover:bg-red-50/50 transition group"
                >
                  <div className="text-[10px] font-bold text-slate-800 group-hover:text-red-700">Requester</div>
                  <div className="text-[9px] text-slate-500 truncate">Salmah</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('manager')}
                  className="p-2 border border-slate-200 rounded-lg text-left hover:border-amber-300 hover:bg-amber-50/50 transition group"
                >
                  <div className="text-[10px] font-bold text-slate-800 group-hover:text-amber-700">Superior</div>
                  <div className="text-[9px] text-slate-500 truncate">Nor Intan</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('hod')}
                  className="p-2 border border-slate-200 rounded-lg text-left hover:border-emerald-300 hover:bg-emerald-50/50 transition group"
                >
                  <div className="text-[10px] font-bold text-slate-800 group-hover:text-emerald-700">HOD</div>
                  <div className="text-[9px] text-slate-500 truncate">Dona Zawina</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Multi-User Disclaimer Footer */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured and synchronized in real-time with Firebase Cloud Firestore.</span>
        </div>
      </div>
    </div>
  );
};
