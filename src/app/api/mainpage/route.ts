import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextApiRequest, res: NextApiResponse<any>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase configuration missing' });
  }

  const { tags, city, startDate, endDate } = req.query;
  const supabase = createClient();

  let query = supabase.from('posts').select('*');

  if (tags) {
    try {
      query = query.contains('tags', JSON.parse(tags as string));
    } catch (error) {
      return res.status(400).json({ error: 'Invalid tags format' });
    }
  }

  if (city) {
    query = query.eq('city', city as string);
  }

  if (startDate) {
    query = query.gte('start_date', startDate as string);
  }

  if (endDate) {
    query = query.lte('end_date', endDate as string);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }

  res.status(200).json(data);
}
