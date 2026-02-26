import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// const supabaseUrl = 'https://your-project.supabase.co'
// const supabaseKey = 'your-anon-key'

// // 只在這裡建立一次
// export const supabase = createClient(supabaseUrl, supabaseKey)