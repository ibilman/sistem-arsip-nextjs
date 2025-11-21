'use client';

import { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function RollAccordion({ roll, boxes, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openBoxes, setOpenBoxes] = useState({});
  const supabase = createClientComponentClient();

  const toggleBox = (boxId) => {
    setOpenBoxes(prev => ({
      ...prev,
      [boxId]: !prev[boxId]
    }));
  };

  const handleDeleteRoll = async () => {
    if (confirm('Yakin hapus Roll ini? Semua Box dan Surat akan ikut terhapus!')) {
      const { error } = await supabase
        .from('roll_o_pack')
        .delete()
        .eq('id', roll.id);
      
      if (!error) {
        onDelete();
      }
    }
  };

  const handleDeleteBox = async (boxId) => {
    if (confirm('Yakin hapus Box ini? Semua Surat akan ikut terhapus!')) {
      const { error } = await supabase
        .from('box_arsip')
        .delete()
        .eq('id', boxId);
      
      if (!error) {
        onDelete();
      }
    }
  };

  const handleDeleteSurat = async (suratId) => {
    if (confirm('Yakin hapus surat ini?')) {
      const { error } = await supabase
        .from('surat')
        .delete()
        .eq('id', suratId);
      
      if (!error) {
        onDelete();
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <ChevronDown
              className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
              size={24}
              style={{ color: '#9333ea' }}
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                📚 {roll.nama}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Lokasi:</span> {roll.lokasi}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {roll.box_count || 0} Box
                </span>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  {roll.surat_count || 0} Surat
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteRoll();
            }}
            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition flex items-center space-x-2"
          >
            <Trash2 size={18} />
            <span>Hapus Roll</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-6 max-h-[600px] overflow-y-auto">
          {boxes.map((box) => (
            <div key={box.id} className="ml-8 mb-4 border-l-4 border-purple-500 pl-4">
              <div
                className="cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition"
                onClick={() => toggleBox(box.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ChevronDown
                      className={`transform transition-transform ${openBoxes[box.id] ? 'rotate-180' : ''}`}
                      size={20}
                      style={{ color: '#9333ea' }}
                    />
                    <h4 className="text-lg font-semibold text-gray-800">
                      📦 {box.nama}
                    </h4>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                      {box.surat_count || 0} surat
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBox(box.id);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition flex items-center space-x-1"
                  >
                    <Trash2 size={14} />
                    <span>Hapus Box</span>
                  </button>
                </div>
              </div>

              {openBoxes[box.id] && (
                <div className="mt-4 max-h-[400px] overflow-y-auto">
                  {box.surats && box.surats.length > 0 ? (
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-purple-600 to-blue-500">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">
                              Nomor Surat
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">
                              Tanggal
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">
                              Perihal
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {box.surats.map((surat) => (
                            <tr key={surat.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {surat.nomor_surat}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {new Date(surat.tanggal).toLocaleDateString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {surat.perihal}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleDeleteSurat(surat.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition flex items-center space-x-1 mx-auto"
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
                  ) : (
                    <p className="text-gray-500 text-center py-8 italic">
                      Belum ada surat
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}