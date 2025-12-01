'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AddSuratPage() {
  const [boxes, setBoxes] = useState([]);
  const [jras, setJras] = useState([]);
  const [boxId, setBoxId] = useState('');
  const [jraId, setJraId] = useState('');
  const [nomorSurat, setNomorSurat] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [perihal, setPerihal] = useState('');
  const [pengirim, setPengirim] = useState('');
  const [penerima, setPenerima] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [boxesData, jrasData] = await Promise.all([
      supabase
        .from('box_arsip')
        .select(`
          *,
          roll_o_pack (
            nama
          )
        `)
        .order('nama'),
      supabase
        .from('jra')
        .select('*')
        .order('kode')
    ]);

    setBoxes(boxesData.data || []);
    setJras(jrasData.data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('surat')
      .insert([{
        box_id: boxId,
        jra_id: jraId || null,
        nomor_surat: nomorSurat,
        tanggal,
        perihal,
        pengirim,
        penerima,
        keterangan
      }]);

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Surat berhasil ditambahkan!');
      // Reset form
      setBoxId('');
      setJraId('');
      setNomorSurat('');
      setTanggal(new Date().toISOString().split('T')[0]);
      setPerihal('');
      setPengirim('');
      setPenerima('');
      setKeterangan('');
      setTimeout(() => {
        router.push('/view-all');
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tambah Surat Baru</h1>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Box Arsip *
              </label>
              <select
                value={boxId}
                onChange={(e) => setBoxId(e.target.value)}
                className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
                required
              >
                <option value="">-- Pilih Box --</option>
                {boxes.map((box) => (
                  <option key={box.id} value={box.id}>
                    {box.roll_o_pack?.nama} → {box.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                JRA (Jangka Retensi)
              </label>
              <select
                value={jraId}
                onChange={(e) => setJraId(e.target.value)}
                className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
              >
                <option value="">-- Pilih JRA (Opsional) --</option>
                {jras.map((jra) => (
                  <option key={jra.id} value={jra.id}>
                    {jra.kode} - {jra.jenis_arsip} ({jra.retensi_aktif + jra.retensi_inaktif} tahun)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Surat *
              </label>
              <input
                type="text"
                value={nomorSurat}
                onChange={(e) => setNomorSurat(e.target.value)}
                className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
                placeholder="Contoh: 001/DIR/2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal *
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Perihal *
            </label>
            <input
              type="text"
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
              className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
              placeholder="Contoh: Undangan Rapat"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pengirim
              </label>
              <input
                type="text"
                value={pengirim}
                onChange={(e) => setPengirim(e.target.value)}
                className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
                placeholder="Nama pengirim"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Penerima
              </label>
              <input
                type="text"
                value={penerima}
                onChange={(e) => setPenerima(e.target.value)}
                className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
                placeholder="Nama penerima"
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
              className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition outline-none"
              rows="3"
              placeholder="Keterangan tambahan..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? 'Menyimpan...' : 'Simpan Surat'}
          </button>
        </form>
      </div>
    </div>
  );
}
