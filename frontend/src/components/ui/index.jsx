import React from 'react';

export const Toast = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-500 dark:bg-emerald-600',
    error: 'bg-rose-500 dark:bg-rose-600',
    warning: 'bg-amber-500 dark:bg-amber-600',
    info: 'bg-sky-500 dark:bg-sky-600',
  };

  return (
    <div className="fixed top-5 right-5 z-[100] animate-slide-down">
      <div className={`${styles[type] || styles.info} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px]`}>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
};

export const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Save', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}/>
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full animate-scale-in border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="px-6 py-5 text-gray-700 dark:text-gray-300 max-h-[60vh] overflow-y-auto">{children}</div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">{cancelText}</button>
          {onConfirm && (
            <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 transition-colors">{confirmText}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-indigo-200 dark:border-gray-600 border-t-indigo-600 dark:border-t-indigo-400"/>
  </div>
);

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 ${className}`}>{children}</div>
);

export const Button = ({ children, variant = 'primary', className = '', isLoading = false, ...props }) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 px-4 py-2 text-sm gap-2';
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-md shadow-indigo-500/25 focus:ring-indigo-500',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 focus:ring-gray-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/25 focus:ring-rose-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/25 focus:ring-emerald-500',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>}
      {children}
    </button>
  );
};

export const Input = ({ label, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>}
    <input {...props} className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:ring-indigo-400/40 dark:focus:border-indigo-400 transition-all duration-200 ${error ? 'border-rose-400 dark:border-rose-500' : 'border-gray-300 dark:border-gray-600'}`}/>
    {error && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1.5">{error}</p>}
  </div>
);

export const Select = ({ label, options, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>}
    <select {...props} className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200 ${error ? 'border-rose-400' : 'border-gray-300 dark:border-gray-600'}`}>
      {options?.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
    </select>
    {error && <p className="text-rose-500 text-xs mt-1.5">{error}</p>}
  </div>
);

export const Table = ({ columns, data, onRowClick }) => (
  <div className="overflow-x-auto rounded-xl">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          {columns.map((col) => (
            <th key={col.key} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {data.map((row, idx) => (
          <tr key={row._id} className={`cursor-pointer transition-colors hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'}`} onClick={() => onRowClick?.(row)}>
            {columns.map((col) => (
              <td key={col.key} className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">{col.render ? col.render(row) : row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Pagination = ({ current, total, pages, onPageChange }) => (
  <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Page <span className="font-medium text-gray-700 dark:text-gray-200">{current}</span> of <span className="font-medium text-gray-700 dark:text-gray-200">{pages}</span> ({total} total)
    </p>
    <div className="flex items-center gap-1.5">
      <button onClick={() => onPageChange(current - 1)} disabled={current === 1} className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors">← Prev</button>
      {Array.from({ length: Math.min(pages, 5) }).map((_, i) => {
        let pn = pages <= 5 ? i + 1 : current <= 3 ? i + 1 : current >= pages - 2 ? pages - 4 + i : current - 2 + i;
        return (
          <button key={pn} onClick={() => onPageChange(pn)} className={`w-9 h-9 text-sm font-medium rounded-lg transition-all ${current === pn ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}>{pn}</button>
        );
      })}
      <button onClick={() => onPageChange(current + 1)} disabled={current === pages || pages === 0} className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors">Next →</button>
    </div>
  </div>
);

export const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    green: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    yellow: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    red: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    purple: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${colors[color]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"/>
      {children}
    </span>
  );
};
