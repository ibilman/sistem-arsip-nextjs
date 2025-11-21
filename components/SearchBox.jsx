'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBox({ onSearch }) {
  const [searchType, setSearchType] = useState('all');
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ type: searchType, query });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Search className="mr-2" size={24} />
        Pencarian Surat
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cari berdasarkan:
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none text-gray-900"
            >
              <option value="all">Semua Field</option>
              <option value="nomor">Nomor Surat</option>
              <option value="tanggal">Tanggal</option>
              <option value="perihal">Perihal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kata kunci:
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none text-gray-900"
              placeholder="Ketik untuk mencari..."
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Cari
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}