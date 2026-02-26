// Supabase Configuration
// These values are set during infrastructure setup (/setup-alpacapps-infra)
const SUPABASE_URL = 'https://lnqxarwqckpmirpmixcw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucXhhcndxY2twbWlycG1peGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjAyMDIsImV4cCI6MjA4NzY5NjIwMn0.bw8b5XUcEFExlfTrR78Bu4Vdl7Oe_RtjlgvWA7SlQfo';

// Initialize Supabase client
const supabase = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Storage helpers
const STORAGE = {
    photos: {
        bucket: 'photos',
        getPublicUrl: (path) => `${SUPABASE_URL}/storage/v1/object/public/photos/${path}`,
    },
    documents: {
        bucket: 'documents',
    },
};
