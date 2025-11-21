'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import StatCard from '@/components/StatCard';
import RollAccordion from '@/components/RollAccordion';

export default function ViewAllPage() {
  const [stats, setStats] = useState({ rolls: 0, boxes: 0, surats: 0 });
  const [rolls, setRolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Load stats
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

    // Load rolls with boxes and surats
    const { data: rollsWithData } = await supabase
      .from('roll_o_pack')
      .select(`
        *,
        box_arsip (
          *,
          surat (*)
        )
      `)
      .order('nama');

    // Transform data
    const transformedRolls = (rollsWithData || []).map(roll => {
      const boxes = roll.box_arsip || [];
      const totalSurats = boxes.reduce((sum, box) => sum + (box.surat?.length || 0), 0);
      
      return {
        ...roll,
        box_count: boxes.length,
        surat_count: totalSurats
      };
    });

    setRolls(transformedRolls);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Semua Arsip</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon="📚" number={stats.rolls} label="Roll O Pack" color="purple" />
        <StatCard icon="📦" number={stats.boxes} label="Box Arsip" color="blue" />
        <StatCard icon="📄" number={stats.surats} label="Total Surat" color="green" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar Roll O Pack</h2>

      {rolls.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Belum ada Roll O Pack</p>
          <p className="text-gray-400 mt-2">Silakan tambah Roll O Pack terlebih dahulu</p>
        </div>
      ) : (
        rolls.map((roll) => {
          const boxes = roll.box_arsip || [];
          const boxesWithSurats = boxes.map(box => ({
            ...box,
            surats: box.surat || [],
            surat_count: box.surat?.length || 0
          }));

          return (
            <RollAccordion
              key={roll.id}
              roll={roll}
              boxes={boxesWithSurats}
              onDelete={loadData}
            />
          );
        })
      )}
    </div>
  );
}