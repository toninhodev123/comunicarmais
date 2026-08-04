import { createClient } from "@supabase/supabase-js";

// Chave publicavel: segura para expor no navegador (protegida pelas
// politicas de RLS no banco). Configure em .env.local — veja .env.example.
const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(url, publishableKey);
