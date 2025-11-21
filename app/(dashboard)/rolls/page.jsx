'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AddRollPage() {
  const [nama, setNama] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('roll_o_pack')
      .insert([{ nama, lokasi, user_id: user.id }]);

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Roll O Pack berhasil ditambahkan!');
      setNama('');
      setLokasi('');
      setTimeout(() => {
        router.push('/view-all');
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-black-800 mb-8">Tambah Roll O Pack Baru</h1>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-black-700 mb-2">
              Nama Roll O Pack *
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
              placeholder="Contoh: Roll A-01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black-700 mb-2">
              Lokasi *
            </label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
              placeholder="Contoh: Gudang Lantai 2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? 'Menyimpan...' : 'Simpan Roll O Pack'}
          </button>
        </form>
      </div>
    </div>
  );
}
