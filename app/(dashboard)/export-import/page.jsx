'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Download, Upload, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExportImportPage() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExportAll = async () => {
    setExporting(true);
    setMessage('');

    try {
      // Fetch all data
      const [rollsData, boxesData, suratsData] = await Promise.all([
        supabase.from('roll_o_pack').select('*').order('nama'),
        supabase
          .from('box_arsip')
          .select(`
            *,
            roll_o_pack (nama)
          `)
          .order('nama'),
        supabase
          .from('surat')
          .select(`
            *,
            box_arsip (
              nama,
              roll_o_pack (nama)
            ),
            jra (kode)
          `)
          .order('tanggal', { ascending: false })
      ]);

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Sheet 1: Rolls
      const rollsSheet = XLSX.utils.json_to_sheet(
        (rollsData.data || []).map(r => ({
          'Nama Roll': r.nama,
          'Lokasi': r.lokasi,
          'Tanggal Dibuat': new Date(r.created_at).toLocaleDateString('id-ID')
        }))
      );
      XLSX.utils.book_append_sheet(wb, rollsSheet, 'Roll O Pack');

      // Sheet 2: Boxes
      const boxesSheet = XLSX.utils.json_to_sheet(
        (boxesData.data || []).map(b => ({
          'Nama Box': b.nama,
          'Roll': b.roll_o_pack?.nama || '',
          'Keterangan': b.keterangan || '',
          'Tanggal Dibuat': new Date(b.created_at).toLocaleDateString('id-ID')
        }))
      );
      XLSX.utils.book_append_sheet(wb, boxesSheet, 'Box Arsip');

      // Sheet 3: Surat
      const suratSheet = XLSX.utils.json_to_sheet(
        (suratsData.data || []).map(s => ({
          'Nomor Surat': s.nomor_surat,
          'Tanggal': new Date(s.tanggal).toLocaleDateString('id-ID'),
          'Perihal': s.perihal,
          'Pengirim': s.pengirim || '',
          'Penerima': s.penerima || '',
          'Roll': s.box_arsip?.roll_o_pack?.nama || '',
          'Box': s.box_arsip?.nama || '',
          'JRA': s.jra?.kode || '',
          'Status Retensi': s.status_retensi,
          'Keterangan': s.keterangan || ''
        }))
      );
      XLSX.utils.book_append_sheet(wb, suratSheet, 'Surat');

      // Download
      XLSX.writeFile(wb, `arsip_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      setMessage('Export berhasil! File sudah didownload.');
    } catch (error) {
      setMessage('Error: ' + error.message);
    }

    setExporting(false);
  };

  const handleExportSurat = async () => {
    setExporting(true);
    setMessage('');

    try {
      const { data } = await supabase
        .from('surat')
        .select(`
          *,
          box_arsip (
            nama,
            roll_o_pack (nama)
          ),
          jra (kode)
        `)
        .order('tanggal', { ascending: false });

      const ws = XLSX.utils.json_to_sheet(
        (data || []).map(s => ({
          'Nomor Surat': s.nomor_surat,
          'Tanggal': new Date(s.tanggal).toLocaleDateString('id-ID'),
          'Perihal': s.perihal,
          'Pengirim': s.pengirim || '',
          'Penerima': s.penerima || '',
          'Roll': s.box_arsip?.roll_o_pack?.nama || '',
          'Box': s.box_arsip?.nama || '',
          'JRA': s.jra?.kode || '',
          'Status Retensi': s.status_retensi,
          'Keterangan': s.keterangan || ''
        }))
      );

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Daftar Surat');
      XLSX.writeFile(wb, `daftar_surat_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      setMessage('Export surat berhasil! File sudah didownload.');
    } catch (error) {
      setMessage('Error: ' + error.message);
    }

    setExporting(false);
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        'Nomor Surat': '001/DIR/2024',
        'Tanggal': '2024-01-15',
        'Perihal': 'Undangan Rapat',
        'Pengirim': 'Direktur',
        'Penerima': 'Kepala Divisi',
        'Nama Roll': 'Roll A-01',
        'Nama Box': 'Box A-01-001',
        'Keterangan': 'Rapat bulanan'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Import');
    XLSX.writeFile(wb, 'template_import_surat.xlsx');
    setMessage('Template berhasil didownload!');
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage('');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      let success = 0;
      let failed = 0;
      const errors = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        // Validasi
        if (!row['Nomor Surat'] || !row['Tanggal'] || !row['Perihal'] || !row['Nama Roll'] || !row['Nama Box']) {
          failed++;
          errors.push(`Baris ${i + 2}: Data tidak lengkap`);
          continue;
        }

        try {
          // Parse tanggal
          let tanggal;
          if (typeof row['Tanggal'] === 'number') {
            // Excel date
            const date = new Date((row['Tanggal'] - 25569) * 86400 * 1000);
            tanggal = date.toISOString().split('T')[0];
          } else {
            // String date
            const parts = row['Tanggal'].split('/');
            if (parts.length === 3) {
              tanggal = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            } else {
              tanggal = row['Tanggal'];
            }
          }

          // Cari atau buat Roll
          let { data: roll } = await supabase
            .from('roll_o_pack')
            .select('id')
            .eq('nama', row['Nama Roll'])
            .single();

          if (!roll) {
            const { data: newRoll } = await supabase
              .from('roll_o_pack')
              .insert([{ nama: row['Nama Roll'], lokasi: 'Auto Import' }])
              .select()
              .single();
            roll = newRoll;
          }

          // Cari atau buat Box
          let { data: box } = await supabase
            .from('box_arsip')
            .select('id')
            .eq('nama', row['Nama Box'])
            .eq('roll_id', roll.id)
            .single();

          if (!box) {
            const { data: newBox } = await supabase
              .from('box_arsip')
              .insert([{ 
                roll_id: roll.id, 
                nama: row['Nama Box'], 
                keterangan: 'Auto Import' 
              }])
              .select()
              .single();
            box = newBox;
          }

          // Insert Surat
          const { error } = await supabase
            .from('surat')
            .insert([{
              box_id: box.id,
              nomor_surat: row['Nomor Surat'],
              tanggal: tanggal,
              perihal: row['Perihal'],
              pengirim: row['Pengirim'] || null,
              penerima: row['Penerima'] || null,
              keterangan: row['Keterangan'] || null
            }]);

          if (error) throw error;
          success++;
        } catch (error) {
          failed++;
          errors.push(`Baris ${i + 2}: ${error.message}`);
        }
      }

      let msg = `Import selesai! Berhasil: ${success}, Gagal: ${failed}`;
      if (errors.length > 0) {
        msg += `\n\nError pertama:\n${errors.slice(0, 5).join('\n')}`;
        if (errors.length > 5) {
          msg += `\n... dan ${errors.length - 5} error lainnya`;
        }
      }
      setMessage(msg);
    } catch (error) {
      setMessage('Error membaca file: ' + error.message);
    }

    setImporting(false);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Export & Import Data</h1>

      {message && (
        <div className={`p-4 rounded-lg mb-6 whitespace-pre-line ${
          message.includes('Error') || message.includes('Gagal') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Export Section */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-6">
        <div className="flex items-center mb-6">
          <Download className="mr-3 text-green-600" size={28} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Export ke Excel</h2>
            <p className="text-sm text-gray-600">Download data arsip dalam format Excel (.xlsx)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportAll}
            disabled={exporting}
            className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <FileSpreadsheet size={20} />
            <span>{exporting ? 'Exporting...' : 'Export Semua Data'}</span>
          </button>

          <button
            onClick={handleExportSurat}
            disabled={exporting}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <FileSpreadsheet size={20} />
            <span>{exporting ? 'Exporting...' : 'Export Surat Saja'}</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-6">
        <div className="flex items-center mb-6">
          <Upload className="mr-3 text-purple-600" size={28} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Import dari Excel</h2>
            <p className="text-sm text-gray-600">Upload file Excel untuk import data surat</p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm text-blue-800 font-semibold mb-2">Format File Excel:</p>
          <ul className="text-sm text-blue-700 space-y-1 ml-4">
            <li>• Nomor Surat (wajib)</li>
            <li>• Tanggal (wajib, format: YYYY-MM-DD atau DD/MM/YYYY)</li>
            <li>• Perihal (wajib)</li>
            <li>• Pengirim (opsional)</li>
            <li>• Penerima (opsional)</li>
            <li>• Nama Roll (wajib)</li>
            <li>• Nama Box (wajib)</li>
            <li>• Keterangan (opsional)</li>
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-purple-500 transition">
          <Upload className="text-gray-400 mb-4" size={48} />
          <label className="cursor-pointer">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 inline-block">
              {importing ? 'Importing...' : 'Pilih File Excel'}
            </span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImport}
              disabled={importing}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 mt-3">Atau drag & drop file di sini</p>
        </div>
      </div>

      {/* Template Section */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center mb-6">
          <FileSpreadsheet className="mr-3 text-gray-600" size={28} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Template Excel</h2>
            <p className="text-sm text-gray-600">Download template untuk memudahkan import data</p>
          </div>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Download Template</span>
        </button>
      </div>
    </div>
  );
}