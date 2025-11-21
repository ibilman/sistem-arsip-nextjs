import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Create client untuk dipakai di semua component
export const supabase = createClientComponentClient();

// Export function untuk create client juga (kalau butuh)
export const createClient = () => {
  return createClientComponentClient();
};