import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Toast, Button, Input } from '@/components/ui';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      setToast({ message: 'Welcome back!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 800);
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
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter text-[#F0F4FF] mb-2">FIRE<span className="text-[#FF5B14]">CRM</span></h1>
          <p className="text-[#7B8BAD] font-bold text-xs uppercase tracking-[2px]">Premium Sales Intelligence</p>
        </div>

        <div className="bg-[#0b0f1a] rounded-[24px] border border-white/7 p-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#F0F4FF]">Agent Login</h2>
            <p className="text-[#7B8BAD] text-sm mt-1">Enter your credentials to access the terminal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
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
              Authorize Session
            </Button>
          </form>

          <p className="text-center text-xs font-bold text-[#7B8BAD] uppercase tracking-widest mt-8">
            Unauthorized?{' '}
            <Link to="/register" className="text-[#FF8A3D] hover:text-[#FF5B14] transition-colors">Request Access</Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block p-4 rounded-xl bg-white/2 border border-white/5 backdrop-blur-sm">
            <p className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-[1.5px] mb-2">Internal Demo Keys</p>
            <p className="text-[11px] font-mono text-[#F0F4FF]/70">admin@example.com / password123</p>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>}
    </div>
  );
};
