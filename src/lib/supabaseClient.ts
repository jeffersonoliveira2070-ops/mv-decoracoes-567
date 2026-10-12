// ====== CLIENTE SUPABASE ======
// Singleton seguro: usa apenas a anon key (nunca a service_role).
// A anon key é pública por design — ela é protegida pelas políticas RLS.

import { createClient } from "@supabase/supabase-js";

const rawUrl = (import.meta.env["VITE_SUPABASE_URL"] as string) || "";
const rawKey = (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string) || "";

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    rawUrl &&
      rawKey &&
      !rawUrl.includes("SEU_PROJETO") &&
      !rawKey.includes("...") &&
      rawUrl.startsWith("http"),
  );
};

const supabaseUrl = isSupabaseConfigured() ? rawUrl : "https://placeholder.supabase.co";
const supabaseAnonKey = isSupabaseConfigured() ? rawKey : "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persiste sessão no localStorage do browser (renovação automática do token)
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// ====== TIPOS DO BANCO (Conforme estrutura existente no Supabase) ======

export interface AdminUser {
  user_id: string;
  ativo: boolean;
  created_at?: string;
}

export interface Avaliacao {
  id: string;
  nome: string;
  nota: number;
  comentario: string;
  aprovado: boolean;
  created_at?: string;
}

export interface Momento {
  id: string;
  nome: string | null;
  legenda: string | null;
  media_url: string;
  media_type: "imagem" | "video" | string;
  aprovado: boolean;
  created_at?: string;
}

// ====== UPLOAD DE MÍDIA VIA STORAGE ======

/**
 * Faz upload de mídia para o Supabase Storage existente.
 * Retorna a URL pública do arquivo enviado.
 */
export async function uploadMediaToStorage(
  file: File,
  bucketName: string = "momentos",
): Promise<{ url: string | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { url: null, error: "Supabase não configurado" };
  }

  try {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const bucketsToTry = [
      bucketName,
      "momentos",
      "midias",
      "galeria",
      "fotos",
      "uploads",
      "public",
    ].filter((b, idx, arr) => arr.indexOf(b) === idx);

    let lastError = "";
    for (const b of bucketsToTry) {
      const { data, error } = await supabase.storage.from(b).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (!error && data) {
        const { data: pubData } = supabase.storage.from(b).getPublicUrl(path);
        if (pubData?.publicUrl) {
          return { url: pubData.publicUrl };
        }
      } else if (error) {
        lastError = error.message;
      }
    }

    return {
      url: null,
      error: lastError || "Não foi possível enviar o arquivo para o bucket do Supabase Storage.",
    };
  } catch (err: any) {
    return { url: null, error: err?.message || "Erro durante o upload" };
  }
}
