import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://swrlvioxgngzljykzlxn.supabase.co'
const supabaseKey = 'sb_publishable_y-V0yz5kfxJyq7_QB6VZjg_x3T7uKjd'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)