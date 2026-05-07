import React from 'react';

// Common Transition
const transition = 'transition-all duration-200 ease-in-out';

export const Toast = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-500 shadow-emerald-500/20',
    error: 'bg-rose-500 shadow-rose-500/20',
    warning: 'bg-amber-500 shadow-amber-500/20',
    info: 'bg-sky-500 shadow-sky-500/20',
  };

  return (
    <div className="fixed top-8 right-8 z-[100] animate-fade-in">
      <div className={`${styles[type] || styles.info} text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-4 min-w-[320px] border border-white/10`}>
        <p className="text-sm font-semibold tracking-wide flex-1">{message}</p>
        <button onClick={onClose} className="hover:bg-white/20 rounded-lg p-1.5 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
};

export const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Save', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#060810]/80 backdrop-blur-md animate-fade-in" onClick={onClose}/>
      <div className="relative bg-[#111827] rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.6)] max-w-xl w-full animate-fade-up border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <h2 className="text-2xl font-bold tracking-tight text-[#F0F4FF]">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-[#7B8BAD] hover:text-[#F0F4FF] hover:bg-white/5 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="px-8 py-8 text-[#7B8BAD] max-h-[65vh] overflow-y-auto">{children}</div>
        <div className="flex justify-end gap-4 px-8 py-6 border-t border-white/5 bg-white/2">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-[#F0F4FF] border border-white/10 rounded-xl hover:bg-white/5 transition-colors">{cancelText}</button>
          {onConfirm && (
            <Button onClick={onConfirm}>{confirmText}</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-white/5"/>
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF5B14] animate-spin shadow-[0_0_15px_#FF5B14]"/>
    </div>
  </div>
);

export const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-[#0b0f1a] rounded-[16px] border border-white/7 shadow-2xl card-shimmer group hover:border-[#FF5B14]/25 hover:-translate-y-0.5 transition-all duration-300 ${noPadding ? '' : 'p-8'} ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, variant = 'primary', className = '', isLoading = false, ...props }) => {
  const base = 'inline-flex items-center justify-center font-bold rounded-[10px] transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 gap-2.5 px-7 py-3 text-sm tracking-wide';
  
  const variants = {
    primary: 'bg-gradient-to-br from-[#FF5B14] to-[#c84010] text-white shadow-[0_6px_30px_rgba(255,91,20,0.35)] hover:shadow-[0_12px_40px_rgba(255,91,20,0.5)] hover:-translate-y-0.5 relative overflow-hidden before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100',
    secondary: 'bg-white/5 text-[#F0F4FF] border border-white/7 hover:border-[#FF5B14]/40 hover:bg-[#FF5B14]/5',
    danger: 'bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white',
    success: 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white',
    ghost: 'text-[#7B8BAD] hover:text-[#F0F4FF] hover:bg-white/5',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      )}
      {children}
    </button>
  );
};

export const Input = ({ label, error, icon, ...props }) => (
  <div className="mb-6">
    {label && <label className="block text-xs font-bold text-[#7B8BAD] uppercase tracking-widest mb-2.5">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B8BAD]">{icon}</div>}
      <input 
        {...props} 
        className={`w-full ${icon ? 'pl-12' : 'px-5'} py-3.5 rounded-xl border bg-white text-[#060810] font-medium placeholder-[#9ca3af] focus:outline-none focus:ring-4 focus:ring-[#FF5B14]/10 focus:border-[#FF5B14]/50 transition-all duration-200 ${error ? 'border-rose-500/50' : 'border-white/20'}`}
      />
    </div>
    {error && <p className="text-rose-500 text-xs font-medium mt-2 ml-1">{error}</p>}
  </div>
);

export const Select = ({ label, options, error, ...props }) => (
  <div className="mb-6">
    {label && <label className="block text-xs font-bold text-[#7B8BAD] uppercase tracking-widest mb-2.5">{label}</label>}
    <select {...props} className={`w-full px-5 py-3.5 rounded-xl border bg-white text-[#060810] font-medium focus:outline-none focus:ring-4 focus:ring-[#FF5B14]/10 focus:border-[#FF5B14]/50 transition-all duration-200 appearance-none cursor-pointer ${error ? 'border-rose-500/50' : 'border-white/20'}`}>
      {options?.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
    </select>
    {error && <p className="text-rose-500 text-xs font-medium mt-2 ml-1">{error}</p>}
  </div>
);

export const Table = ({ columns, data, onRowClick }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-white/5">
          {columns.map((col) => (
            <th key={col.key} className="px-6 py-4 text-left text-[11px] font-bold text-[#7B8BAD] uppercase tracking-[2px]">{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr 
            key={row._id} 
            className="group cursor-pointer border-b border-white/5 hover:bg-[#FF5B14]/4 transition-colors"
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <td key={col.key} className={`px-6 py-5 text-sm ${col.isMono ? 'font-mono text-[#F0F4FF]/90' : 'text-[#F0F4FF]'}`}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Pagination = ({ current, total, pages, onPageChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/5">
      <p className="text-xs font-medium text-[#7B8BAD] uppercase tracking-widest">
        Page <span className="font-bold text-[#FF5B14]">{current}</span> of {pages}
      </p>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(current - 1)} 
          disabled={current === 1} 
          className="p-2.5 rounded-xl border border-white/10 text-[#F0F4FF] hover:bg-[#FF5B14]/5 hover:border-[#FF5B14]/30 disabled:opacity-20 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button 
          onClick={() => onPageChange(current + 1)} 
          disabled={current === pages || pages === 0} 
          className="p-2.5 rounded-xl border border-white/10 text-[#F0F4FF] hover:bg-[#FF5B14]/5 hover:border-[#FF5B14]/30 disabled:opacity-20 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
};

export const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    orange: 'bg-[#FF5B14]/10 border-[#FF5B14]/30 text-[#FF8A3D]',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    green: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    yellow: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    red: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    purple: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    gray: 'bg-white/5 border-white/10 text-[#7B8BAD]',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold border rounded-full uppercase tracking-wider ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
};

export const StatCard = ({ label, value, trend, icon }) => (
  <Card className="flex flex-col gap-1">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[11px] font-bold text-[#7B8BAD] uppercase tracking-[1.5px]">{label}</span>
      <div className="p-2 rounded-lg bg-white/5 text-[#FF5B14]">{icon}</div>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-4xl font-bold font-mono tracking-tighter text-[#F0F4FF] leading-none">
        {value}
      </span>
      {trend && (
        <span className={`text-xs font-bold font-mono ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend}
        </span>
      )}
    </div>
  </Card>
);
