# 🚀 Sistem Arsip Surat - Next.js + Supabase

Aplikasi manajemen arsip surat digital modern dengan Next.js 14 dan Supabase.

## ✨ Features

- 🔐 **Authentication** - Login system dengan Supabase Auth
- 📚 **Roll Management** - Kelola Roll O Pack
- 📦 **Box Management** - Kelola Box Arsip
- 📄 **Surat Management** - CRUD surat lengkap
- ⏱️ **JRA** - Jangka Retensi Arsip
- 🔍 **Advanced Search** - Cari berdasarkan nomor, tanggal, perihal
- 📊 **Export/Import** - Excel export/import dengan template
- 📱 **Responsive** - Mobile friendly
- 🎨 **Modern UI** - Tailwind CSS dengan gradient & animations
- ⚡ **Real-time** - Update otomatis (Supabase real-time)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Excel**: SheetJS (xlsx)
- **Deployment**: Vercel

## 📦 Installation

### 1. Clone Repository

\`\`\`bash
git clone <repository-url>
cd sistem-arsip-nextjs
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Setup Supabase

1. Buat project di https://supabase.com
2. Jalankan SQL migration (lihat dokumentasi di artifact)
3. Copy API keys

### 4. Environment Variables

Copy `.env.local.example` ke `.env.local` dan isi:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Buka http://localhost:3000

### 6. Login

Default credentials:
- Email: admin@arsip.com
- Password: admin123