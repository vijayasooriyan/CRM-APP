import React from 'react';

export const Toast = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded shadow-lg z-50`}>
      {message}
    </div>
  );
};

export const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Save', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input = ({ label, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export const Select = ({ label, options, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      {...props}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">Select {label?.toLowerCase()}</option>
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export const Table = ({ columns, data, onRowClick, actions }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-100 border-b border-gray-300">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              {col.label}
            </th>
          ))}
          {actions && <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={row._id}
            className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <td key={col.key} className="px-6 py-3 text-sm text-gray-700">
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
            {actions && (
              <td className="px-6 py-3 text-sm">
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  {actions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => action.onClick(row)}
                      className={`text-${action.color}-600 hover:text-${action.color}-800 font-medium`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Pagination = ({ current, total, pages, onPageChange }) => (
  <div className="flex items-center justify-between mt-4">
    <p className="text-sm text-gray-600">
      Showing {current} of {total}
    </p>
    <div className="flex gap-2">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
      >
        Previous
      </button>
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 border rounded ${
            current === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === pages}
        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
);
