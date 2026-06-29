const SUPABASE_URL = 'https://fdjoqjjzoayobtywfcto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkam9xamp6b2F5b2J0eXdmY3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTQ3NzksImV4cCI6MjA5ODIzMDc3OX0.YeCtTdxB9C__Ih6DMeRJVmd3d-YS5qmcGG7Sze3okBI';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getImageUrl(path, bucket = 'productos') {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const { data } = db.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
