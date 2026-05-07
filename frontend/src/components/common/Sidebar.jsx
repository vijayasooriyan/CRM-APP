import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const NavItem = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-[3px] ${
        isActive
          ? 'bg-[#FF5B14]/10 border-[#FF5B14] text-[#FF8A3D]'
          : 'border-transparent text-[#7B8BAD] hover:text-[#F0F4FF] hover:bg-white/4'
      }`
    }
  >
    <span className="text-xl">{icon}</span>
    <span className="text-sm font-bold tracking-wide uppercase">{label}</span>
  </NavLink>
);

export const Sidebar = ({ onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose?.();
  };

  return (
    <aside className="h-full w-[280px] bg-[#0b0f1a] border-r border-white/7 flex flex-col z-40 relative">
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="lg:hidden absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-[#7B8BAD] hover:text-rose-500 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      {/* Logo */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF5B14] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,91,20,0.4)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <span className="text-2xl font-bold tracking-tighter text-[#F0F4FF]">FIRE<span className="text-[#FF5B14]">CRM</span></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="px-4 mb-4 text-[11px] font-bold text-[#7B8BAD]/50 uppercase tracking-[2px]">Core</div>
        <NavItem to="/dashboard" icon="📊" label="Dashboard" onClick={onClose} />
        <NavItem to="/leads" icon="👥" label="Contacts" onClick={onClose} />
        
        <div className="px-4 mt-8 mb-4 text-[11px] font-bold text-[#7B8BAD]/50 uppercase tracking-[2px]">Sales</div>
        <NavItem to="/pipeline" icon="🛤️" label="Pipeline" onClick={onClose} />
      </nav>

      {/* User / Footer */}
      <div className="p-6 border-t border-white/5 bg-white/2">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF5B14] to-[#FFB347] flex items-center justify-center font-bold text-[#060810]">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#F0F4FF] truncate">{user?.username || 'User'}</p>
            <div className="flex items-center gap-1.5">
              <div className="live-indicator" />
              <span className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
      </div>
    </aside>
  );
};
