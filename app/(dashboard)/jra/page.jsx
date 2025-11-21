'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2 } from 'lucide-react';

export default function JRAPage() {
  const [jras, setJras] = useState([]);
  const [kode, setKode] = useState('');
  const [jenisArsip, setJenisArsip] = useState('');
  const [retensiAktif, setRetensiAktif] = useState('');
  const [retensiInaktif, setRetensiInaktif] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadJRAs();
  }, []);

  const loadJRAs = async () => {
    const { data } = await supabase
      .from('jra')
      .select('*')
      .order('kode');
    setJras(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('jra')
      .insert([{
        kode,
        jenis_arsip: jenisArsip,
        retensi_aktif: parseInt(retensiAktif),
        retensi_inaktif: parseInt(retensiInaktif),
        keterangan
      }]);

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('JRA berhasil ditambahkan!');
      setKode('');
      setJenisArsip('');
      setRetensiAktif('');
      setRetensiInaktif('');
      setKeterangan('');
      loadJRAs();
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus JRA ini?')) {
      const { error } = await supabase
        .from('jra')
        .delete()
        .eq('id', id);
      
      if (!error) {
        setMessage('JRA berhasil dihapus!');
        loadJRAs();
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Kelola Jangka Retensi Arsip (JRA)</h1>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tambah JRA Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kode JRA *
              </label>
              <input
                type="text"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
                placeholder="Contoh: A.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jenis Arsip *
              </label>
              <input
                type="text"
                value={jenisArsip}
                onChange={(e) => setJenisArsip(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
                placeholder="Contoh: Surat Keputusan"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Retensi Aktif (tahun) *
              </label>
              <input
                type="number"
                value={retensiAktif}
                onChange={(e) => setRetensiAktif(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
                placeholder="2"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Retensi Inaktif (tahun) *
              </label>
              <input
                type="number"
                value={retensiInaktif}
                onChange={(e) => setRetensiInaktif(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
                placeholder="5"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Keterangan
            </label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
              rows="2"
              placeholder="Keterangan tambahan..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? 'Menyimpan...' : 'Simpan JRA'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Daftar JRA</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">
                  Kode
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">
                  Jenis Arsip
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">
                  Retensi Aktif
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">
                  Retensi Inaktif
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">
                  Keterangan
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jras.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500 italic">
                    Belum ada JRA
                  </td>
                </tr>
              ) : (
                jras.map((jra) => (
                  <tr key={jra.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {jra.kode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {jra.jenis_arsip}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {jra.retensi_aktif} tahun
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {jra.retensi_inaktif} tahun
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                        {jra.retensi_aktif + jra.retensi_inaktif} tahun
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {jra.keterangan || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(jra.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition inline-flex items-center space-x-1"
                      >
                        <Trash2 size={12} />
                        <span>Hapus</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}