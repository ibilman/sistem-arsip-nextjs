'use client';

import { Trash2 } from 'lucide-react';

export default function DeleteButton({ onDelete, label = 'Hapus', size = 'md' }) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={onDelete}
      className={`bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center space-x-2 ${sizeClasses[size]}`}
    >
      <Trash2 size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
      <span>{label}</span>
    </button>
  );
}