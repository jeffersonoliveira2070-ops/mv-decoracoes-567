// ====== AUTENTICAÇÃO DO PAINEL ADMIN ======
//
// Suporta:
// 1. Administrador principal autorizado:
//    jeffersonoliveira2070@gmail.com / lambedor2026
// 2. Autenticação via Supabase Auth + verificação na tabela public.admin_users:
//    (user_id = auth.uid() AND ativo = true)

import { supabase, isSupabaseConfigured } from "./supabaseClient";

export const ADMIN_MASTER_EMAIL = "jeffersonoliveira2070@gmail.com";
export const ADMIN_MASTER_PASS = "lambedor2026";
const ADMIN_SESSION_KEY = "mv_decoracoes_admin_session";

export type AdminLoginResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Autentica o administrador no painel.
 * Valida o administrador mestre ou realiza autenticação via Supabase Auth com validação de admin_users.
 */
export async function signInAdmin(
  email: string,
  password: string,
): Promise<AdminLoginResult> {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Verificação do administrador mestre autorizado
  if (
    normalizedEmail === ADMIN_MASTER_EMAIL &&
    password === ADMIN_MASTER_PASS
  ) {
    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_SESSION_KEY, "true");
    }

    // Se o Supabase estiver configurado, sincroniza a autenticação também
    if (isSupabaseConfigured()) {
      try {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        // Se o usuário ainda não existir no Auth do Supabase, tenta cadastrá-lo automaticamente
        if (
          authError &&
          authError.message.toLowerCase().includes("invalid login")
        ) {
          await supabase.auth.signUp({
            email: normalizedEmail,
            password,
          });
        }
      } catch {
        /* Permite o acesso pelo login administrativo */
      }
    }

    return { ok: true };
  }

  // 2. Autenticação padrão via Supabase Auth
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "E-mail ou senha incorretos.",
    };
  }

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (authError) {
    return { ok: false, message: "E-mail ou senha incorretos." };
  }

  // 3. Verificar permissão de admin (user_id = auth.uid() AND ativo = true)
  const isAdmin = await checkAdminPermission();
  if (!isAdmin) {
    await supabase.auth.signOut();
    return {
      ok: false,
      message: "Acesso negado. Usuário não possui permissão de administrador.",
    };
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
  }

  return { ok: true };
}

// ──────────────────────────────────────────────────────────────
// VERIFICAÇÃO DE PERMISSÃO SUPABASE
// ──────────────────────────────────────────────────────────────

/**
 * Verifica se o usuário autenticado está em public.admin_users com user_id = auth.uid() e ativo = true.
 */
async function checkAdminPermission(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const { data: sessionData } = await supabase.auth.getSession();
  const currentUid = sessionData.session?.user?.id;
  if (!currentUid) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id, ativo")
    .eq("user_id", currentUid)
    .eq("ativo", true)
    .maybeSingle();

  if (error || !data) return false;
  return data.ativo === true && data.user_id === currentUid;
}

// ──────────────────────────────────────────────────────────────
// SESSÃO
// ──────────────────────────────────────────────────────────────

/**
 * Retorna true se há sessão ativa de administrador.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  if (
    typeof window !== "undefined" &&
    localStorage.getItem(ADMIN_SESSION_KEY) === "true"
  ) {
    return true;
  }

  if (!isSupabaseConfigured()) return false;
  const { data } = await supabase.auth.getSession();
  if (!data.session) return false;

  return checkAdminPermission();
}

/**
 * Versão síncrona para renderização inicial sem piscar a tela.
 */
export function isAdminAuthenticatedSync(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(ADMIN_SESSION_KEY) === "true") return true;

  const key = Object.keys(localStorage).find(
    (k) => k.startsWith("sb-") && k.endsWith("-auth-token"),
  );
  return Boolean(key && localStorage.getItem(key ?? ""));
}

// ──────────────────────────────────────────────────────────────
// LOGOUT
// ──────────────────────────────────────────────────────────────

/**
 * Encerra a sessão administrativa.
 */
export async function signOutAdmin(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
  }
}
