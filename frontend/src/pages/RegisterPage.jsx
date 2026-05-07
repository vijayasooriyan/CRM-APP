import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Toast, Button, Input } from '@/components/ui';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(username, email, password);
      setToast({ message: 'Account created! Please login.', type: 'success' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#060810] relative overflow-hidden">
      {/* Background Effects */}
      <div className="orb orb-orange" />
      <div className="orb orb-amber" />
      <div className="orb orb-blue" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF5B14] rounded-2xl mb-6 shadow-[0_0_30px_rgba(255,91,20,0.5)]">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter text-[#F0F4FF] mb-2">FIRE<span className="text-[#FF5B14]">CRM</span></h1>
          <p className="text-[#7B8BAD] font-bold text-xs uppercase tracking-[2px]">Agent Onboarding</p>
        </div>

        <div className="bg-[#0b0f1a] rounded-[24px] border border-white/7 p-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#F0F4FF]">Request Access</h2>
            <p className="text-[#7B8BAD] text-sm mt-1">Create your agent profile to begin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <Input 
              label="Agent Handle (Username)" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              disabled={loading}
              placeholder="e.g. Maverick"
            />
            <Input 
              label="Intelligence ID (Email)" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={loading}
              placeholder="agent@firecrm.tech"
            />
            <Input 
              label="Access Protocol (Password)" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              disabled={loading}
              placeholder="••••••••"
            />

            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-500/10 px-4 py-3 rounded-xl border border-rose-500/20 mb-6 uppercase tracking-wider">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-4" isLoading={loading}>
              Initialize Account
            </Button>
          </form>

          <p className="text-center text-xs font-bold text-[#7B8BAD] uppercase tracking-widest mt-8">
            Registered?{' '}
            <Link to="/login" className="text-[#FF8A3D] hover:text-[#FF5B14] transition-colors">Return to Terminal</Link>
          </p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>}
    </div>
  );
};
