// Autenticação administrativa exclusiva pelo Supabase Auth.
// A autorização exige usuário autenticado e registro ativo em public.admin_users.
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export type AdminLoginResult =
  | { ok: true }
  | { ok: false; message: string };

async function checkAdminPermission(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (userError || !uid) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id, ativo")
    .eq("user_id", uid)
    .eq("ativo", true)
    .maybeSingle();
  return !error && data?.ativo === true && data.user_id === uid;
}

export async function signInAdmin(email: string, password: string): Promise<AdminLoginResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "A autenticação administrativa não está configurada." };
  }
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { ok: false, message: "E-mail ou senha incorretos." };
  if (!(await checkAdminPermission())) {
    await supabase.auth.signOut();
    return { ok: false, message: "Acesso negado. Usuário sem permissão de administrador." };
  }
  return { ok: true };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return checkAdminPermission();
}

// A verificação síncrona nunca autoriza acesso: aguarda confirmação no servidor.
export function isAdminAuthenticatedSync(): boolean {
  return false;
}

export async function signOutAdmin(): Promise<void> {
  if (isSupabaseConfigured()) await supabase.auth.signOut();
  if (typeof window !== "undefined") {
    localStorage.removeItem("mv_decoracoes_admin_session");
  }
}
