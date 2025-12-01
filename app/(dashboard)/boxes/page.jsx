'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AddBoxPage() {
  const [rolls, setRolls] = useState([]);
  const [rollId, setRollId] = useState('');
  const [nama, setNama] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadRolls();
  }, []);

  const loadRolls = async () => {
    const { data } = await supabase
      .from('roll_o_pack')
      .select('*')
      .order('nama');
    setRolls(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('box_arsip')
      .insert([{ roll_id: rollId, nama, keterangan }]);

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Box Arsip berhasil ditambahkan!');
      setRollId('');
      setNama('');
      setKeterangan('');
      setTimeout(() => {
        router.push('/view-all');
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tambah Box Arsip Baru</h1>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pilih Roll O Pack *
            </label>
            <select
              value={rollId}
              onChange={(e) => setRollId(e.target.value)}
              className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
              required
            >
              <option value="">-- Pilih Roll --</option>
              {rolls.map((roll) => (
                <option key={roll.id} value={roll.id}>
                  {roll.nama} - {roll.lokasi}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Box *
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none text-black placeholder-gray-500"
              placeholder="Contoh: Box A-01-001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Keterangan
            </label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
              rows="3"
              placeholder="Keterangan tambahan..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? 'Menyimpan...' : 'Simpan Box Arsip'}
          </button>
        </form>
      </div>
    </div>
  );
}
