'use client';

export default function StatCard({ icon, number, label, color = 'purple' }) {
  const colorClasses = {
    purple: 'from-purple-600 to-blue-500',
    blue: 'from-blue-600 to-cyan-500',
    green: 'from-green-600 to-emerald-500',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold mb-1">{number}</p>
          <p className="text-sm opacity-90 font-medium">{label}</p>
        </div>
        <div className="text-5xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
}