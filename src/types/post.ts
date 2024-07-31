import { Database } from '@/types/supabase';

export type Post = Database['public']['Tables']['posts']['Row'];
