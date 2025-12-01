'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import StatCard from '@/components/StatCard';
import SearchBox from '@/components/SearchBox';
import { Trash2 } from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState({ rolls: 0, boxes: 0, surats: 0 });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [rollsData, boxesData, suratsData] = await Promise.all([
      supabase.from('roll_o_pack').select('id', { count: 'exact', head: true }),
      supabase.from('box_arsip').select('id', { count: 'exact', head: true }),
      supabase.from('surat').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      rolls: rollsData.count || 0,
      boxes: boxesData.count || 0,
      surats: suratsData.count || 0,
    });
  };

  const handleSearch = async ({ type, query }) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    let queryBuilder = supabase
      .from('surat')
      .select(`
        *,
        box_arsip (
          nama,
          roll_o_pack (
            nama,
            lokasi
          )
        )
      `);

    if (type === 'nomor') {
      queryBuilder = queryBuilder.ilike('nomor_surat', `%${query}%`);
    } else if (type === 'tanggal') {
      queryBuilder = queryBuilder.eq('tanggal', query);
    } else if (type === 'perihal') {
      queryBuilder = queryBuilder.ilike('perihal', `%${query}%`);
    } else {
      queryBuilder = queryBuilder.or(`nomor_surat.ilike.%${query}%,perihal.ilike.%${query}%`);
    }

    const { data } = await queryBuilder;
    setSearchResults(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus surat ini?')) {
      await supabase.from('surat').delete().eq('id', id);
      handleSearch({ type: 'all', query: '' });
      loadStats();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon="📚" number={stats.rolls} label="Roll O Pack" color="purple" />
        <StatCard icon="📦" number={stats.boxes} label="Box Arsip" color="blue" />
        <StatCard icon="📄" number={stats.surats} label="Total Surat" color="green" />
      </div>

      <SearchBox onSearch={handleSearch} />

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Hasil Pencarian ({searchResults.length} surat ditemukan)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-purple-600 to-blue-500">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">
                    Nomor Surat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">
                    Perihal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults.map((surat) => (
                  <tr key={surat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {surat.nomor_surat}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(surat.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {surat.perihal}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="text-xs">
                        <div>📚 {surat.box_arsip?.roll_o_pack?.nama}</div>
                        <div className="text-gray-500">
                          └─ 📦 {surat.box_arsip?.nama}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(surat.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition inline-flex items-center space-x-1"
                      >
                        <Trash2 size={12} />
                        <span>Hapus</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
