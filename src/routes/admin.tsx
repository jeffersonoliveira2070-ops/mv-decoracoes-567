import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react";
import {
  isAdminAuthenticated,
  signInAdmin,
  signOutAdmin,
} from "@/lib/adminAuth";
import {
  useSiteContent,
  type SiteContent,
  type NavItem,
  type StepItem,
  type ThemeItem,
  type PriceItem,
  type GalleryPhotoItem,
  type RentalItem,
  type FeatureItem,
  type TestimonialItem,
  type FaqItem,
  type CustomSectionItem,
  type CustomInteractiveButton,
  exportContentJson,
  importContentJson,
  readFileAsDataUrl,
} from "@/lib/contentStore";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Sliders,
  Layers,
  Building,
  HelpCircle,
  MessageSquare,
  Package,
  CheckCircle2,
  Smartphone,
  Type,
  LayoutTemplate,
  Star,
  Lock,
  LogOut,
  Camera,
  MessageSquareQuote,
  AlertTriangle,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { AvaliacoesManager } from "@/components/admin/AvaliacoesManager";
import { MomentosManager } from "@/components/admin/MomentosManager";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

// ====== TELA DE LOGIN ======
function AdminLoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("jeffersonoliveira2070@gmail.com");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signInAdmin(email, password);
    setLoading(false);
    if (result.ok) {
      onSuccess();
    } else {
      setError(result.message);
      setPassword("");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 px-4">
      {/* Decorative blurred circles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-rose-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 bg-gradient-to-b from-white/10 to-transparent px-8 pt-10 pb-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 ring-1 ring-rose-400/30">
              <Lock className="h-7 w-7 text-rose-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Painel de Admin</h1>
              <p className="mt-1 text-xs text-slate-400">Área restrita — acesso exclusivo para o administrador</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-8 pb-10">
            {!isSupabaseConfigured() && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                <p className="font-semibold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                  Supabase pendente (.env.local)
                </p>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local para liberar o acesso.
                </p>
              </div>
            )}

            {/* E-mail */}
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-xs font-medium text-slate-300">
                E-mail
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none ring-0 transition focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium text-slate-300">
                Senha
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 outline-none ring-0 transition focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPass ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-center text-xs font-medium text-red-400 ring-1 ring-red-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-900/30 transition hover:bg-rose-500 disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Entrar no Painel"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          MV Decorações &copy; {new Date().getFullYear()} &middot; Acesso restrito
        </p>
      </div>
    </div>
  );
}

type TabType =
  | "abas"
  | "negocio"
  | "hero"
  | "como-funciona"
  | "temas"
  | "galeria"
  | "itens"
  | "diferenciais"
  | "depoimentos"
  | "faq"
  | "contato-rodape"
  | "custom-sections"
  | "estilos"
  | "avaliacoes"
  | "momentos";

// ====== GATE PRINCIPAL ======
// Usa verificação síncrona para render inicial (evita piscar) e
// confirma via async após hidratação.
function AdminPage() {
  const [authState, setAuthState] = useState<"loading" | "ok" | "denied">(
    () => "loading",
  );

  useEffect(() => {
    // Verificação assíncrona (fonte de verdade)
    isAdminAuthenticated().then((ok) => {
      setAuthState(ok ? "ok" : "denied");
    });
  }, []);

  if (authState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
          <p className="text-xs text-slate-400">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (authState === "denied") {
    return <AdminLoginGate onSuccess={() => setAuthState("ok")} />;
  }

  return (
    <AdminDashboard
      onLogout={async () => {
        await signOutAdmin();
        setAuthState("denied");
      }}
    />
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { content, save, reset } = useSiteContent();
  const [activeTab, setActiveTab] = useState<TabType>("abas");
  const [tempContent, setTempContent] = useState<SiteContent>(content);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza quando o content for resetado externamente
  const updateContent = (updater: (prev: SiteContent) => SiteContent) => {
    setTempContent((prev) => {
      const next = updater(prev);
      setHasChanges(true);
      return next;
    });
  };

  const handleSave = () => {
    save(tempContent);
    setHasChanges(false);
    toast.success("Todas as alterações foram salvas com sucesso!");
  };

  const handleReset = () => {
    if (confirm("Tem certeza que deseja restaurar todo o site para o conteúdo padrão original?")) {
      reset();
      setTempContent(content);
      setHasChanges(false);
      toast.info("Conteúdo restaurado para o padrão original!");
    }
  };

  const handleExport = () => {
    exportContentJson(tempContent);
    toast.success("Backup do site exportado em JSON com sucesso!");
  };

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = importContentJson(text);
      setTempContent(imported);
      setHasChanges(false);
      toast.success("Backup importado e aplicado com sucesso!");
    } catch {
      toast.error("Arquivo de backup inválido.");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper para upload de imagens
  const handleImageUpload = async (onDone: (dataUrl: string) => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (ev) => {
      const target = ev.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        try {
          const url = await readFileAsDataUrl(file);
          onDone(url);
          toast.success("Imagem carregada com sucesso!");
        } catch {
          toast.error("Erro ao carregar a imagem.");
        }
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Bar Fixa */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" /> Ver Site
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-slate-900 dark:text-white">Painel de Admin</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  CMS Ativo
                </span>
                {hasChanges && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                    Alterações pendentes
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Edite abas, textos, imagens, tamanhos e botões
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExport}
              title="Baixar cópia de segurança dos dados"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            >
              <Download className="h-3.5 w-3.5" /> Exportar
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Importar dados de um arquivo JSON"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            >
              <Upload className="h-3.5 w-3.5" /> Importar
            </button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />

            <button
              onClick={handleReset}
              title="Restaurar dados originais"
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Resetar
            </button>

            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition ${
                hasChanges
                  ? "bg-emerald-600 hover:bg-emerald-700 animate-pulse"
                  : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              }`}
            >
              <Save className="h-3.5 w-3.5" /> Salvar Alterações
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                if (confirm("Sair do painel de admin? Você precisará digitar a senha novamente.")) {
                  onLogout();
                }
              }}
              title="Sair do painel"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
            >
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          </div>
        </div>

        {/* Barra de Abas de Navegação do Painel */}
        <div className="mx-auto flex max-w-7xl overflow-x-auto border-t border-slate-200 px-4 scrollbar-none dark:border-slate-800 sm:px-6">
          {[
            { id: "abas", label: "Abas & Menu", icon: Layers },
            { id: "negocio", label: "Identidade & Negócio", icon: Building },
            { id: "hero", label: "Início (Hero)", icon: Sparkles },
            { id: "como-funciona", label: "Como Funciona", icon: CheckCircle2 },
            { id: "temas", label: "Temas & Preços", icon: Package },
            { id: "galeria", label: "Galeria de Fotos", icon: ImageIcon },
            { id: "itens", label: "Itens de Locação", icon: LayoutTemplate },
            { id: "diferenciais", label: "Diferenciais", icon: Sliders },
            { id: "depoimentos", label: "Depoimentos (Local)", icon: Star },
            { id: "avaliacoes", label: "Avaliações (Supabase)", icon: MessageSquareQuote },
            { id: "momentos", label: "Momentos (Supabase)", icon: Camera },
            { id: "faq", label: "Perguntas (FAQ)", icon: HelpCircle },
            { id: "contato-rodape", label: "Contato & Rodapé", icon: MessageSquare },
            { id: "custom-sections", label: "+ Criar Novas Seções", icon: Plus },
            { id: "estilos", label: "Tamanhos & Aparência", icon: Type },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-medium transition ${
                  active
                    ? "border-primary text-primary dark:border-rose-400 dark:text-rose-400"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Conteúdo da Aba Ativa */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* ABA: ABAS & MENU */}
        {activeTab === "abas" && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold">Abas de Navegação & Menu</h2>
                <p className="text-sm text-slate-500">
                  Crie novas abas, altere nomes, mude a ordem (subir/descer) e oculte ou exiba no menu superior.
                </p>
              </div>
              <button
                onClick={() => {
                  const newId = `aba-${Date.now()}`;
                  updateContent((prev) => ({
                    ...prev,
                    navItems: [
                      ...prev.navItems,
                      {
                        id: newId,
                        label: "Nova Aba",
                        href: `#${newId}`,
                        isVisible: true,
                        order: prev.navItems.length + 1,
                      },
                    ],
                  }));
                  toast.success("Nova aba adicionada!");
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow transition hover:opacity-95"
              >
                <Plus className="h-4 w-4" /> Adicionar Nova Aba
              </button>
            </div>

            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
              {tempContent.navItems
                .sort((a, b) => a.order - b.order)
                .map((item, idx, arr) => (
                  <div key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {idx + 1}
                      </span>
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              navItems: prev.navItems.map((n) => (n.id === item.id ? { ...n, label: val } : n)),
                            }));
                          }}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          placeholder="Nome da Aba"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Destino/Link:</span>
                          <input
                            type="text"
                            value={item.href}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => ({
                                ...prev,
                                navItems: prev.navItems.map((n) => (n.id === item.id ? { ...n, href: val } : n)),
                              }));
                            }}
                            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                            placeholder="#secao ou link"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {/* Subir */}
                      <button
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const prevItem = arr[idx - 1]!;
                          updateContent((prev) => ({
                            ...prev,
                            navItems: prev.navItems.map((n) => {
                              if (n.id === item.id) return { ...n, order: prevItem.order };
                              if (n.id === prevItem.id) return { ...n, order: item.order };
                              return n;
                            }),
                          }));
                        }}
                        title="Mover para cima"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>

                      {/* Descer */}
                      <button
                        disabled={idx === arr.length - 1}
                        onClick={() => {
                          if (idx === arr.length - 1) return;
                          const nextItem = arr[idx + 1]!;
                          updateContent((prev) => ({
                            ...prev,
                            navItems: prev.navItems.map((n) => {
                              if (n.id === item.id) return { ...n, order: nextItem.order };
                              if (n.id === nextItem.id) return { ...n, order: item.order };
                              return n;
                            }),
                          }));
                        }}
                        title="Mover para baixo"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>

                      {/* Visibilidade */}
                      <button
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            navItems: prev.navItems.map((n) =>
                              n.id === item.id ? { ...n, isVisible: !n.isVisible } : n,
                            ),
                          }));
                        }}
                        title={item.isVisible ? "Ocultar do menu" : "Exibir no menu"}
                        className={`rounded-lg p-2 ${
                          item.isVisible
                            ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {item.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>

                      {/* Excluir */}
                      <button
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            navItems: prev.navItems.filter((n) => n.id !== item.id),
                          }));
                          toast.info("Aba removida.");
                        }}
                        title="Excluir aba"
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ABA: IDENTIDADE & NEGÓCIO */}
        {activeTab === "negocio" && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold">Identidade e Dados do Negócio</h2>
              <p className="text-sm text-slate-500">
                Informações de contato e dados da marca exibidos em todo o site.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nome da Empresa / Marca
                </label>
                <input
                  type="text"
                  value={tempContent.business.nome}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      business: { ...prev.business, nome: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Cidade e Estado de Atendimento
                </label>
                <input
                  type="text"
                  value={tempContent.business.cidade}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      business: { ...prev.business, cidade: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Telefone de Contato
                  </label>
                  <input
                    type="text"
                    value={tempContent.business.telefone}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        business: { ...prev.business, telefone: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Instagram (sem @)
                  </label>
                  <input
                    type="text"
                    value={tempContent.business.instagram}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        business: { ...prev.business, instagram: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Link Direto do WhatsApp (com wa.me)
                </label>
                <input
                  type="text"
                  value={tempContent.business.waDirect}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      business: { ...prev.business, waDirect: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              {/* Ajuste do Logo */}
              <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Tamanho do Logo no Cabeçalho ({tempContent.globalStyles.logoSizePx}px)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="24"
                    max="96"
                    step="2"
                    value={tempContent.globalStyles.logoSizePx}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateContent((prev) => ({
                        ...prev,
                        globalStyles: { ...prev.globalStyles, logoSizePx: val },
                      }));
                    }}
                    className="w-full"
                  />
                  <span className="w-16 rounded-lg bg-slate-100 py-1 text-center font-mono text-xs font-bold dark:bg-slate-800">
                    {tempContent.globalStyles.logoSizePx}px
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: INÍCIO (HERO) */}
        {activeTab === "hero" && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h2 className="text-xl font-bold">Seção Início (Hero)</h2>
              <p className="text-sm text-slate-500">
                Controle os textos principais, imagem de destaque, tamanhos e botões interativos do topo do site.
              </p>
            </div>

            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* Textos */}
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Kicker (Texto pequeno no topo)
                    </label>
                    <select
                      value={tempContent.hero.kickerSize}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, kickerSize: e.target.value as any },
                        }))
                      }
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    >
                      <option value="xs">Tamanho Pequeno (xs)</option>
                      <option value="sm">Tamanho Médio (sm)</option>
                      <option value="base">Tamanho Normal (base)</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={tempContent.hero.kicker}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, kicker: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Título Principal (H1)
                      </label>
                      <select
                        value={tempContent.hero.titleSize}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, titleSize: e.target.value as any },
                          }))
                        }
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      >
                        <option value="sm">Pequeno (3xl)</option>
                        <option value="md">Médio (4xl)</option>
                        <option value="lg">Grande (5xl)</option>
                        <option value="xl">Gigante (6xl)</option>
                        <option value="2xl">Ultra (7xl)</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={tempContent.hero.title}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, title: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Palavra com Destaque Dourado/Itálico
                    </label>
                    <input
                      type="text"
                      value={tempContent.hero.highlightText}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, highlightText: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Descrição Principal
                    </label>
                    <select
                      value={tempContent.hero.descSize}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, descSize: e.target.value as any },
                        }))
                      }
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    >
                      <option value="sm">Tamanho Pequeno</option>
                      <option value="base">Tamanho Padrão</option>
                      <option value="lg">Tamanho Grande</option>
                    </select>
                  </div>
                  <textarea
                    rows={3}
                    value={tempContent.hero.description}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, description: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Aviso de Frete / Entrega
                  </label>
                  <input
                    type="text"
                    value={tempContent.hero.shippingNote}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, shippingNote: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Imagem de Destaque e Tamanhos */}
              <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  Imagem de Destaque do Hero
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                        URL da Imagem
                      </label>
                      <input
                        type="text"
                        value={tempContent.hero.imageUrl}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, imageUrl: e.target.value },
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                        placeholder="Cole uma URL ou faça upload abaixo"
                      />
                    </div>
                    <button
                      onClick={() =>
                        handleImageUpload((dataUrl) =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, imageUrl: dataUrl },
                          })),
                        )
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Upload className="h-4 w-4" /> Enviar Foto do Computador
                    </button>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Tamanho da Imagem
                        </label>
                        <select
                          value={tempContent.hero.imageScale}
                          onChange={(e) =>
                            updateContent((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, imageScale: e.target.value as any },
                            }))
                          }
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="sm">Pequena (max-w-sm)</option>
                          <option value="md">Média (max-w-md)</option>
                          <option value="lg">Grande (max-w-lg)</option>
                          <option value="full">Largura Total</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Borda Arredondada
                        </label>
                        <select
                          value={tempContent.hero.imageRadius}
                          onChange={(e) =>
                            updateContent((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, imageRadius: e.target.value as any },
                            }))
                          }
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="sm">Suave (rounded-md)</option>
                          <option value="lg">Média (rounded-xl)</option>
                          <option value="2xl">Forte (rounded-2xl)</option>
                          <option value="3xl">Orgânica (rounded-[2rem])</option>
                          <option value="full">Totalmente Circular</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Preview da Imagem */}
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <span className="mb-2 text-xs font-semibold text-slate-400">Pré-visualização</span>
                    <img
                      src={tempContent.hero.imageUrl}
                      alt="Preview Hero"
                      className="max-h-48 rounded-2xl object-cover shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Botões Interativos do Hero */}
              <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  Botões Interativos do Hero
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Botão Principal (Destaque)
                      </span>
                      <button
                        onClick={() =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, showPrimaryBtn: !prev.hero.showPrimaryBtn },
                          }))
                        }
                        className="text-xs font-semibold text-primary"
                      >
                        {tempContent.hero.showPrimaryBtn ? "Visível" : "Oculto"}
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={tempContent.hero.primaryBtnText}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, primaryBtnText: e.target.value },
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                        placeholder="Texto do botão"
                      />
                      <input
                        type="text"
                        value={tempContent.hero.primaryBtnUrl}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, primaryBtnUrl: e.target.value },
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                        placeholder="Link do botão"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Botão Secundário
                      </span>
                      <button
                        onClick={() =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, showSecondaryBtn: !prev.hero.showSecondaryBtn },
                          }))
                        }
                        className="text-xs font-semibold text-primary"
                      >
                        {tempContent.hero.showSecondaryBtn ? "Visível" : "Oculto"}
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={tempContent.hero.secondaryBtnText}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, secondaryBtnText: e.target.value },
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                        placeholder="Texto do botão"
                      />
                      <input
                        type="text"
                        value={tempContent.hero.secondaryBtnUrl}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, secondaryBtnUrl: e.target.value },
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                        placeholder="Link do botão"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: COMO FUNCIONA */}
        {activeTab === "como-funciona" && (
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold">Seção Como Funciona</h2>
                <p className="text-sm text-slate-500">
                  Gerencie os passos explicativos, títulos e notas de entrega.
                </p>
              </div>
              <button
                onClick={() => {
                  const newStep: StepItem = {
                    id: `step-${Date.now()}`,
                    stepNum: tempContent.howItWorks.steps.length + 1,
                    title: "Novo Passo",
                    desc: "Descrição detalhada do passo.",
                    iconName: "Sparkles",
                  };
                  updateContent((prev) => ({
                    ...prev,
                    howItWorks: {
                      ...prev.howItWorks,
                      steps: [...prev.howItWorks.steps, newStep],
                    },
                  }));
                  toast.success("Novo passo adicionado!");
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow"
              >
                <Plus className="h-4 w-4" /> Adicionar Passo
              </button>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Kicker
                  </label>
                  <input
                    type="text"
                    value={tempContent.howItWorks.kicker}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        howItWorks: { ...prev.howItWorks, kicker: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Título da Seção
                  </label>
                  <input
                    type="text"
                    value={tempContent.howItWorks.title}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        howItWorks: { ...prev.howItWorks, title: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Aviso de Entrega e Retirada
                </label>
                <input
                  type="text"
                  value={tempContent.howItWorks.bannerNote}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      howItWorks: { ...prev.howItWorks, bannerNote: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              {/* Lista de Passos */}
              <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">
                  Passos Cadastrados
                </h3>
                <div className="space-y-3">
                  {tempContent.howItWorks.steps.map((st, i) => (
                    <div
                      key={st.id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-1 items-start gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={st.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => ({
                                ...prev,
                                howItWorks: {
                                  ...prev.howItWorks,
                                  steps: prev.howItWorks.steps.map((s) =>
                                    s.id === st.id ? { ...s, title: val } : s,
                                  ),
                                },
                              }));
                            }}
                            className="w-full rounded-lg border border-slate-300 p-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
                            placeholder="Título do passo"
                          />
                          <textarea
                            rows={2}
                            value={st.desc}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => ({
                                ...prev,
                                howItWorks: {
                                  ...prev.howItWorks,
                                  steps: prev.howItWorks.steps.map((s) =>
                                    s.id === st.id ? { ...s, desc: val } : s,
                                  ),
                                },
                              }));
                            }}
                            className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                            placeholder="Descrição do passo"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            howItWorks: {
                              ...prev.howItWorks,
                              steps: prev.howItWorks.steps.filter((s) => s.id !== st.id),
                            },
                          }));
                          toast.info("Passo removido.");
                        }}
                        className="self-end rounded-lg p-2 text-red-500 hover:bg-red-50 sm:self-center dark:hover:bg-red-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: TEMAS & PREÇOS */}
        {activeTab === "temas" && (
          <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold">Temas e Planos de Preços</h2>
                <p className="text-sm text-slate-500">
                  Adicione novos temas com fotos, ajuste a altura das imagens e altere valores dos pacotes.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newTema: ThemeItem = {
                      id: `tema-${Date.now()}`,
                      nome: "Novo Tema",
                      img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
                      cat: "Infantil",
                      btnText: "Quero este tema",
                      imageHeight: "normal",
                    };
                    updateContent((prev) => ({
                      ...prev,
                      themesSection: {
                        ...prev.themesSection,
                        temas: [...prev.themesSection.temas, newTema],
                      },
                    }));
                    toast.success("Novo tema adicionado!");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow"
                >
                  <Plus className="h-4 w-4" /> Adicionar Tema
                </button>

                <button
                  onClick={() => {
                    const newPreco: PriceItem = {
                      id: `preco-${Date.now()}`,
                      nome: "Novo Pacote",
                      valor: "R$ 150,00",
                      obs: "Descrição dos itens inclusos.",
                      destaque: false,
                    };
                    updateContent((prev) => ({
                      ...prev,
                      themesSection: {
                        ...prev.themesSection,
                        precos: [...prev.themesSection.precos, newPreco],
                      },
                    }));
                    toast.success("Novo pacote de preço adicionado!");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <Plus className="h-4 w-4" /> Adicionar Preço
                </button>
              </div>
            </div>

            {/* Lista de Temas */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-base font-bold">Catálogo de Temas</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tempContent.themesSection.temas.map((tm) => (
                  <div
                    key={tm.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-800">
                      <img src={tm.img} alt={tm.nome} className="h-full w-full object-cover" />
                      <button
                        onClick={() =>
                          handleImageUpload((dataUrl) =>
                            updateContent((prev) => ({
                              ...prev,
                              themesSection: {
                                ...prev.themesSection,
                                temas: prev.themesSection.temas.map((t) =>
                                  t.id === tm.id ? { ...t, img: dataUrl } : t,
                                ),
                              },
                            })),
                          )
                        }
                        className="absolute bottom-2 right-2 rounded-lg bg-black/70 px-2 py-1 text-[11px] font-medium text-white shadow hover:bg-black"
                      >
                        Trocar Foto
                      </button>
                    </div>

                    <div className="flex-1 space-y-3 p-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400">Nome do Tema</label>
                        <input
                          type="text"
                          value={tm.nome}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              themesSection: {
                                ...prev.themesSection,
                                temas: prev.themesSection.temas.map((t) =>
                                  t.id === tm.id ? { ...t, nome: val } : t,
                                ),
                              },
                            }));
                          }}
                          className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-400">Categoria</label>
                          <input
                            type="text"
                            value={tm.cat}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => ({
                                ...prev,
                                themesSection: {
                                  ...prev.themesSection,
                                  temas: prev.themesSection.temas.map((t) =>
                                    t.id === tm.id ? { ...t, cat: val } : t,
                                  ),
                                },
                              }));
                            }}
                            className="w-full rounded-lg border border-slate-300 p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-400">Altura Img</label>
                          <select
                            value={tm.imageHeight}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              updateContent((prev) => ({
                                ...prev,
                                themesSection: {
                                  ...prev.themesSection,
                                  temas: prev.themesSection.temas.map((t) =>
                                    t.id === tm.id ? { ...t, imageHeight: val } : t,
                                  ),
                                },
                              }));
                            }}
                            className="w-full rounded-lg border border-slate-300 p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                          >
                            <option value="short">Baixa</option>
                            <option value="normal">Normal</option>
                            <option value="tall">Alta</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => {
                            updateContent((prev) => ({
                              ...prev,
                              themesSection: {
                                ...prev.themesSection,
                                temas: prev.themesSection.temas.filter((t) => t.id !== tm.id),
                              },
                            }));
                            toast.info("Tema removido.");
                          }}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Excluir tema
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabela de Preços */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-base font-bold">Tabela de Preços & Pacotes</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {tempContent.themesSection.precos.map((pr) => (
                  <div
                    key={pr.id}
                    className={`rounded-2xl border p-5 ${
                      pr.destaque
                        ? "border-primary bg-primary/5 dark:border-rose-400/40"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <input
                        type="text"
                        value={pr.nome}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            themesSection: {
                              ...prev.themesSection,
                              precos: prev.themesSection.precos.map((p) =>
                                p.id === pr.id ? { ...p, nome: val } : p,
                              ),
                            },
                          }));
                        }}
                        className="rounded-lg border border-slate-300 p-1.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-800"
                      />
                      <button
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            themesSection: {
                              ...prev.themesSection,
                              precos: prev.themesSection.precos.map((p) =>
                                p.id === pr.id ? { ...p, destaque: !p.destaque } : p,
                              ),
                            },
                          }));
                        }}
                        className={`text-[10px] font-bold uppercase ${
                          pr.destaque ? "text-primary" : "text-slate-400"
                        }`}
                      >
                        {pr.destaque ? "★ Destaque" : "Normal"}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400">Valor</label>
                        <input
                          type="text"
                          value={pr.valor}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              themesSection: {
                                ...prev.themesSection,
                                precos: prev.themesSection.precos.map((p) =>
                                  p.id === pr.id ? { ...p, valor: val } : p,
                                ),
                              },
                            }));
                          }}
                          className="w-full rounded-lg border border-slate-300 p-2 text-lg font-bold text-primary dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400">Observações</label>
                        <textarea
                          rows={2}
                          value={pr.obs}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              themesSection: {
                                ...prev.themesSection,
                                precos: prev.themesSection.precos.map((p) =>
                                  p.id === pr.id ? { ...p, obs: val } : p,
                                ),
                              },
                            }));
                          }}
                          className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>

                      <button
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            themesSection: {
                              ...prev.themesSection,
                              precos: prev.themesSection.precos.filter((p) => p.id !== pr.id),
                            },
                          }));
                          toast.info("Pacote removido.");
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Excluir pacote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA: GALERIA DE FOTOS */}
        {activeTab === "galeria" && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold">Galeria de Fotos ({tempContent.gallery.fotos.length} fotos)</h2>
                <p className="text-sm text-slate-500">
                  Adicione novas fotos, selecione categorias e proporção das imagens da galeria.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleImageUpload((dataUrl) => {
                      const newFoto: GalleryPhotoItem = {
                        id: `foto-${Date.now()}`,
                        n: tempContent.gallery.fotos.length + 1,
                        img: dataUrl,
                        cat: "Infantil",
                        aspect: "portrait",
                      };
                      updateContent((prev) => ({
                        ...prev,
                        gallery: {
                          ...prev.gallery,
                          fotos: [newFoto, ...prev.gallery.fotos],
                        },
                      }));
                      toast.success("Foto adicionada à galeria!");
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow"
                >
                  <Upload className="h-4 w-4" /> Upload Nova Foto
                </button>
              </div>
            </div>

            {/* Categorias da Galeria */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Filtros / Categorias Ativas:
              </label>
              <div className="flex flex-wrap gap-2">
                {tempContent.gallery.categories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Grade de Fotos */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {tempContent.gallery.fotos.map((f) => (
                <div
                  key={f.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
                >
                  <img src={f.img} alt={`Foto ${f.n}`} className="aspect-[3/4] w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 text-[10px] text-white opacity-90 transition group-hover:opacity-100">
                    <select
                      value={f.cat}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateContent((prev) => ({
                          ...prev,
                          gallery: {
                            ...prev.gallery,
                            fotos: prev.gallery.fotos.map((item) =>
                              item.id === f.id ? { ...item, cat: val } : item,
                            ),
                          },
                        }));
                      }}
                      className="w-full rounded bg-slate-800 p-1 text-[10px] text-white"
                    >
                      {tempContent.gallery.categories
                        .filter((c) => c !== "Todas")
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={() => {
                        updateContent((prev) => ({
                          ...prev,
                          gallery: {
                            ...prev.gallery,
                            fotos: prev.gallery.fotos.filter((item) => item.id !== f.id),
                          },
                        }));
                        toast.info("Foto removida.");
                      }}
                      className="mt-1 block w-full text-center text-red-400 hover:text-red-300"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: ITENS DE LOCAÇÃO */}
        {activeTab === "itens" && (
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold">Itens Avulsos para Locação</h2>
                <p className="text-sm text-slate-500">
                  Gerencie as peças de locação exibidas no catálogo avulso.
                </p>
              </div>
              <button
                onClick={() => {
                  const newItem: RentalItem = {
                    id: `item-${Date.now()}`,
                    label: "Novo Item",
                    iconName: "Gem",
                  };
                  updateContent((prev) => ({
                    ...prev,
                    rentalSection: {
                      ...prev.rentalSection,
                      items: [...prev.rentalSection.items, newItem],
                    },
                  }));
                  toast.success("Novo item adicionado!");
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow"
              >
                <Plus className="h-4 w-4" /> Adicionar Peça/Item
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {tempContent.rentalSection.items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <input
                    type="text"
                    value={it.label}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        rentalSection: {
                          ...prev.rentalSection,
                          items: prev.rentalSection.items.map((i) =>
                            i.id === it.id ? { ...i, label: val } : i,
                          ),
                        },
                      }));
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
                  />
                  <button
                    onClick={() => {
                      updateContent((prev) => ({
                        ...prev,
                        rentalSection: {
                          ...prev.rentalSection,
                          items: prev.rentalSection.items.filter((i) => i.id !== it.id),
                        },
                      }));
                      toast.info("Item removido.");
                    }}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: DIFERENCIAIS */}
        {activeTab === "diferenciais" && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h2 className="text-xl font-bold">Nossos Diferenciais</h2>
              <p className="text-sm text-slate-500">
                Edite os 4 pilares de confiança da empresa.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {tempContent.features.items.map((feat) => (
                <div
                  key={feat.id}
                  className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <input
                    type="text"
                    value={feat.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        features: {
                          ...prev.features,
                          items: prev.features.items.map((f) =>
                            f.id === feat.id ? { ...f, title: val } : f,
                          ),
                        },
                      }));
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm font-bold dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Título do diferencial"
                  />
                  <textarea
                    rows={2}
                    value={feat.desc}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        features: {
                          ...prev.features,
                          items: prev.features.items.map((f) =>
                            f.id === feat.id ? { ...f, desc: val } : f,
                          ),
                        },
                      }));
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Descrição do diferencial"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: DEPOIMENTOS */}
        {activeTab === "depoimentos" && (
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold">Depoimentos de Clientes</h2>
                <p className="text-sm text-slate-500">
                  Gerencie as avaliações com foto, comentários e estrelas.
                </p>
              </div>
              <button
                onClick={() => {
                  const newDep: TestimonialItem = {
                    id: `dep-${Date.now()}`,
                    nome: "Cliente Satisfeito",
                    texto: "Festa incrível, tudo perfeito e impecável!",
                    foto: tempContent.gallery.fotos[0]?.img ?? "",
                    stars: 5,
                  };
                  updateContent((prev) => ({
                    ...prev,
                    testimonials: {
                      ...prev.testimonials,
                      items: [...prev.testimonials.items, newDep],
                    },
                  }));
                  toast.success("Novo depoimento adicionado!");
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow"
              >
                <Plus className="h-4 w-4" /> Adicionar Depoimento
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tempContent.testimonials.items.map((dp) => (
                <div
                  key={dp.id}
                  className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={dp.foto}
                      alt={dp.nome}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <button
                      onClick={() =>
                        handleImageUpload((dataUrl) =>
                          updateContent((prev) => ({
                            ...prev,
                            testimonials: {
                              ...prev.testimonials,
                              items: prev.testimonials.items.map((d) =>
                                d.id === dp.id ? { ...d, foto: dataUrl } : d,
                              ),
                            },
                          })),
                        )
                      }
                      className="text-xs text-primary hover:underline"
                    >
                      Trocar Foto
                    </button>
                  </div>

                  <input
                    type="text"
                    value={dp.nome}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        testimonials: {
                          ...prev.testimonials,
                          items: prev.testimonials.items.map((d) =>
                            d.id === dp.id ? { ...d, nome: val } : d,
                          ),
                        },
                      }));
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Nome do cliente"
                  />

                  <textarea
                    rows={3}
                    value={dp.texto}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        testimonials: {
                          ...prev.testimonials,
                          items: prev.testimonials.items.map((d) =>
                            d.id === dp.id ? { ...d, texto: val } : d,
                          ),
                        },
                      }));
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Texto do depoimento"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-amber-500">★★★★★ 5 Estrelas</span>
                    <button
                      onClick={() => {
                        updateContent((prev) => ({
                          ...prev,
                          testimonials: {
                            ...prev.testimonials,
                            items: prev.testimonials.items.filter((d) => d.id !== dp.id),
                          },
                        }));
                        toast.info("Depoimento removido.");
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: PERGUNTAS FREQUENTES (FAQ) */}
        {activeTab === "faq" && (
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold">Perguntas Frequentes (FAQ)</h2>
                <p className="text-sm text-slate-500">
                  Crie, edite e reordene perguntas e respostas para os clientes.
                </p>
              </div>
              <button
                onClick={() => {
                  const newFaq: FaqItem = {
                    id: `faq-${Date.now()}`,
                    pergunta: "Nova Pergunta?",
                    resposta: "Escreva a resposta detalhada aqui.",
                  };
                  updateContent((prev) => ({
                    ...prev,
                    faq: {
                      ...prev.faq,
                      items: [...prev.faq.items, newFaq],
                    },
                  }));
                  toast.success("Nova pergunta adicionada ao FAQ!");
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow"
              >
                <Plus className="h-4 w-4" /> Adicionar Pergunta
              </button>
            </div>

            <div className="space-y-4">
              {tempContent.faq.items.map((fq, i) => (
                <div
                  key={fq.id}
                  className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-400">Pergunta #{i + 1}</span>
                    <button
                      onClick={() => {
                        updateContent((prev) => ({
                          ...prev,
                          faq: {
                            ...prev.faq,
                            items: prev.faq.items.filter((f) => f.id !== fq.id),
                          },
                        }));
                        toast.info("Pergunta removida.");
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>

                  <input
                    type="text"
                    value={fq.pergunta}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        faq: {
                          ...prev.faq,
                          items: prev.faq.items.map((f) =>
                            f.id === fq.id ? { ...f, pergunta: val } : f,
                          ),
                        },
                      }));
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Pergunta"
                  />

                  <textarea
                    rows={2}
                    value={fq.resposta}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        faq: {
                          ...prev.faq,
                          items: prev.faq.items.map((f) =>
                            f.id === fq.id ? { ...f, resposta: val } : f,
                          ),
                        },
                      }));
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Resposta"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: CONTATO E RODAPÉ */}
        {activeTab === "contato-rodape" && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold">Contato e Rodapé</h2>
              <p className="text-sm text-slate-500">
                Ajuste os textos do formulário, mensagens e o botão flutuante de WhatsApp.
              </p>
            </div>

            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Formulário de Orçamento</h3>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Título da Seção de Contato
                  </label>
                  <input
                    type="text"
                    value={tempContent.contact.title}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, title: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Descrição do Formulário
                  </label>
                  <input
                    type="text"
                    value={tempContent.contact.description}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, description: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Texto do Botão de Enviar
                  </label>
                  <input
                    type="text"
                    value={tempContent.contact.formButtonText}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, formButtonText: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Botão Flutuante de WhatsApp */}
              <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Botão Flutuante do WhatsApp
                  </h3>
                  <button
                    onClick={() =>
                      updateContent((prev) => ({
                        ...prev,
                        floatingWhatsapp: {
                          ...prev.floatingWhatsapp,
                          isVisible: !prev.floatingWhatsapp.isVisible,
                        },
                      }))
                    }
                    className="text-xs font-semibold text-primary"
                  >
                    {tempContent.floatingWhatsapp.isVisible ? "Ativado" : "Desativado"}
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Tamanho do Botão Flutuante
                    </label>
                    <select
                      value={tempContent.floatingWhatsapp.size}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          floatingWhatsapp: {
                            ...prev.floatingWhatsapp,
                            size: e.target.value as any,
                          },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    >
                      <option value="sm">Pequeno (h-12 w-12)</option>
                      <option value="md">Médio (h-14 w-14)</option>
                      <option value="lg">Grande (h-16 w-16)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Posição na Tela
                    </label>
                    <select
                      value={tempContent.floatingWhatsapp.position}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          floatingWhatsapp: {
                            ...prev.floatingWhatsapp,
                            position: e.target.value as any,
                          },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    >
                      <option value="bottom-right">Canto Inferior Direito</option>
                      <option value="bottom-left">Canto Inferior Esquerdo</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Rodapé */}
              <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Rodapé do Site</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Horário de Atendimento
                    </label>
                    <input
                      type="text"
                      value={tempContent.footer.hoursText}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          footer: { ...prev.footer, hoursText: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Texto de Direitos Autorais
                    </label>
                    <input
                      type="text"
                      value={tempContent.footer.copyrightText}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          footer: { ...prev.footer, copyrightText: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: CRIAR NOVAS SEÇÕES & BOTÕES INTERATIVOS */}
        {activeTab === "custom-sections" && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold">Criador de Novas Seções & Botões</h2>
                <p className="text-sm text-slate-500">
                  Crie blocos sob medida com seus próprios textos, imagens, tamanhos e botões de ação interativos.
                </p>
              </div>
              <button
                onClick={() => {
                  const newSecId = `secao-${Date.now()}`;
                  const newSection: CustomSectionItem = {
                    id: newSecId,
                    navLabel: "Nova Seção",
                    anchorId: newSecId,
                    kicker: "Novidade",
                    title: "Título da Nova Seção",
                    content:
                      "Escreva aqui o conteúdo da sua nova seção personalizada. Você pode adicionar imagens e botões interativos.",
                    isVisible: true,
                    order: tempContent.customSections.length + 1,
                    imageSize: "md",
                    titleSize: "lg",
                    textSize: "base",
                    buttons: [
                      {
                        id: `btn-${Date.now()}`,
                        label: "Falar no WhatsApp",
                        url: tempContent.business.waDirect,
                        style: "primary",
                        size: "md",
                        openNewTab: true,
                      },
                    ],
                  };

                  // Também adiciona a aba no menu
                  const newNavItem: NavItem = {
                    id: newSecId,
                    label: "Nova Seção",
                    href: `#${newSecId}`,
                    isVisible: true,
                    order: tempContent.navItems.length + 1,
                  };

                  updateContent((prev) => ({
                    ...prev,
                    customSections: [...prev.customSections, newSection],
                    navItems: [...prev.navItems, newNavItem],
                  }));
                  toast.success("Nova seção personalizada criada com sucesso!");
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow"
              >
                <Plus className="h-4 w-4" /> Criar Nova Seção Customizada
              </button>
            </div>

            {tempContent.customSections.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
                <LayoutTemplate className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                  Nenhuma seção personalizada criada ainda
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Clique no botão acima para criar novas áreas de conteúdo personalizadas com botões interativos.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {tempContent.customSections.map((sec, secIdx) => (
                  <div
                    key={sec.id}
                    className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex flex-col justify-between gap-2 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          #{secIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={sec.navLabel}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              customSections: prev.customSections.map((s) =>
                                s.id === sec.id ? { ...s, navLabel: val } : s,
                              ),
                              navItems: prev.navItems.map((n) =>
                                n.id === sec.id ? { ...n, label: val } : n,
                              ),
                            }));
                          }}
                          className="rounded-lg border border-slate-300 p-1.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-800"
                          placeholder="Nome no menu"
                        />
                        <span className="text-xs text-slate-400 font-mono">#{sec.anchorId}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            updateContent((prev) => ({
                              ...prev,
                              customSections: prev.customSections.map((s) =>
                                s.id === sec.id ? { ...s, isVisible: !s.isVisible } : s,
                              ),
                            }));
                          }}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                        >
                          {sec.isVisible ? "● Ativa" : "○ Oculta"}
                        </button>
                        <button
                          onClick={() => {
                            updateContent((prev) => ({
                              ...prev,
                              customSections: prev.customSections.filter((s) => s.id !== sec.id),
                              navItems: prev.navItems.filter((n) => n.id !== sec.id),
                            }));
                            toast.info("Seção removida.");
                          }}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Excluir Seção
                        </button>
                      </div>
                    </div>

                    {/* Textos da Seção */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Kicker (Subtítulo superior)
                        </label>
                        <input
                          type="text"
                          value={sec.kicker}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              customSections: prev.customSections.map((s) =>
                                s.id === sec.id ? { ...s, kicker: val } : s,
                              ),
                            }));
                          }}
                          className="w-full rounded-xl border border-slate-300 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>

                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Título da Seção
                          </label>
                          <select
                            value={sec.titleSize || "lg"}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              updateContent((prev) => ({
                                ...prev,
                                customSections: prev.customSections.map((s) =>
                                  s.id === sec.id ? { ...s, titleSize: val } : s,
                                ),
                              }));
                            }}
                            className="rounded border border-slate-200 bg-slate-50 px-1 text-[11px] dark:border-slate-700 dark:bg-slate-800"
                          >
                            <option value="sm">Título Pequeno</option>
                            <option value="md">Título Médio</option>
                            <option value="lg">Título Grande</option>
                            <option value="xl">Título Gigante</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              customSections: prev.customSections.map((s) =>
                                s.id === sec.id ? { ...s, title: val } : s,
                              ),
                            }));
                          }}
                          className="w-full rounded-xl border border-slate-300 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Texto / Conteúdo
                        </label>
                        <select
                          value={sec.textSize || "base"}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            updateContent((prev) => ({
                              ...prev,
                              customSections: prev.customSections.map((s) =>
                                s.id === sec.id ? { ...s, textSize: val } : s,
                              ),
                            }));
                          }}
                          className="rounded border border-slate-200 bg-slate-50 px-1 text-[11px] dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="sm">Fonte Pequena</option>
                          <option value="base">Fonte Padrão</option>
                          <option value="lg">Fonte Grande</option>
                        </select>
                      </div>
                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            customSections: prev.customSections.map((s) =>
                              s.id === sec.id ? { ...s, content: val } : s,
                            ),
                          }));
                        }}
                        className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>

                    {/* Imagem Opcional */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Imagem da Seção (Opcional)
                        </label>
                        <button
                          onClick={() =>
                            handleImageUpload((dataUrl) =>
                              updateContent((prev) => ({
                                ...prev,
                                customSections: prev.customSections.map((s) =>
                                  s.id === sec.id ? { ...s, imageUrl: dataUrl } : s,
                                ),
                              })),
                            )
                          }
                          className="text-xs text-primary hover:underline"
                        >
                          Carregar do Computador
                        </button>
                      </div>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={sec.imageUrl || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              customSections: prev.customSections.map((s) =>
                                s.id === sec.id ? { ...s, imageUrl: val } : s,
                              ),
                            }));
                          }}
                          placeholder="Cole o link da foto ou faça upload"
                          className="flex-1 rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                        <select
                          value={sec.imageSize || "md"}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            updateContent((prev) => ({
                              ...prev,
                              customSections: prev.customSections.map((s) =>
                                s.id === sec.id ? { ...s, imageSize: val } : s,
                              ),
                            }));
                          }}
                          className="rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="sm">Imagem Pequena</option>
                          <option value="md">Imagem Média</option>
                          <option value="lg">Imagem Grande</option>
                        </select>
                      </div>
                      {sec.imageUrl && (
                        <div className="mt-3 flex items-center gap-3">
                          <img
                            src={sec.imageUrl}
                            alt="Preview"
                            className="h-16 w-24 rounded-lg object-cover shadow-sm"
                          />
                          <button
                            onClick={() =>
                              updateContent((prev) => ({
                                ...prev,
                                customSections: prev.customSections.map((s) =>
                                  s.id === sec.id ? { ...s, imageUrl: "" } : s,
                                ),
                              }))
                            }
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remover imagem
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Botões Interativos da Seção */}
                    <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Botões Interativos desta Seção ({sec.buttons.length})
                        </h4>
                        <button
                          onClick={() => {
                            const newBtn: CustomInteractiveButton = {
                              id: `btn-${Date.now()}`,
                              label: "Clique Aqui",
                              url: "https://wa.me/message/CGSSC2KWYNFTG1",
                              style: "primary",
                              size: "md",
                              openNewTab: true,
                            };
                            updateContent((prev) => ({
                              ...prev,
                              customSections: prev.customSections.map((s) =>
                                s.id === sec.id ? { ...s, buttons: [...s.buttons, newBtn] } : s,
                              ),
                            }));
                            toast.success("Botão interativo adicionado!");
                          }}
                          className="inline-flex items-center gap-1 rounded bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
                        >
                          <Plus className="h-3 w-3" /> Adicionar Botão
                        </button>
                      </div>

                      <div className="space-y-3">
                        {sec.buttons.map((btn) => (
                          <div
                            key={btn.id}
                            className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <input
                              type="text"
                              value={btn.label}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateContent((prev) => ({
                                  ...prev,
                                  customSections: prev.customSections.map((s) =>
                                    s.id === sec.id
                                      ? {
                                          ...s,
                                          buttons: s.buttons.map((b) =>
                                            b.id === btn.id ? { ...b, label: val } : b,
                                          ),
                                        }
                                      : s,
                                  ),
                                }));
                              }}
                              placeholder="Texto do Botão"
                              className="rounded border border-slate-300 p-1.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
                            />

                            <input
                              type="text"
                              value={btn.url}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateContent((prev) => ({
                                  ...prev,
                                  customSections: prev.customSections.map((s) =>
                                    s.id === sec.id
                                      ? {
                                          ...s,
                                          buttons: s.buttons.map((b) =>
                                            b.id === btn.id ? { ...b, url: val } : b,
                                          ),
                                        }
                                      : s,
                                  ),
                                }));
                              }}
                              placeholder="URL ou WhatsApp"
                              className="flex-1 rounded border border-slate-300 p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />

                            <select
                              value={btn.style}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                updateContent((prev) => ({
                                  ...prev,
                                  customSections: prev.customSections.map((s) =>
                                    s.id === sec.id
                                      ? {
                                          ...s,
                                          buttons: s.buttons.map((b) =>
                                            b.id === btn.id ? { ...b, style: val } : b,
                                          ),
                                        }
                                      : s,
                                  ),
                                }));
                              }}
                              className="rounded border border-slate-300 p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                            >
                              <option value="primary">Estilo Rosa (Primário)</option>
                              <option value="secondary">Estilo Bege (Secundário)</option>
                              <option value="gold">Estilo Dourado (Gold)</option>
                              <option value="outline">Estilo Borda (Outline)</option>
                            </select>

                            <button
                              onClick={() => {
                                updateContent((prev) => ({
                                  ...prev,
                                  customSections: prev.customSections.map((s) =>
                                    s.id === sec.id
                                      ? {
                                          ...s,
                                          buttons: s.buttons.filter((b) => b.id !== btn.id),
                                        }
                                      : s,
                                  ),
                                }));
                                toast.info("Botão removido.");
                              }}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA: TAMANHOS & APARÊNCIA */}
        {activeTab === "estilos" && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold">Tamanhos e Aparência Geral</h2>
              <p className="text-sm text-slate-500">
                Ajuste os padrões estéticos, arredondamento de bordas e visibilidade de atalhos.
              </p>
            </div>

            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Escala de Arredondamento dos Cards e Blocos
                </label>
                <select
                  value={tempContent.globalStyles.borderRadius}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      globalStyles: { ...prev.globalStyles, borderRadius: e.target.value as any },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="rounded-lg">Discreto (rounded-lg)</option>
                  <option value="rounded-2xl">Moderno Médio (rounded-2xl)</option>
                  <option value="rounded-3xl">Suave Premium (rounded-3xl - Padrão)</option>
                  <option value="rounded-full">Totalmente Curvado (rounded-full)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Botão Flutuante de Atalho para o Admin no Site
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="chk-floating"
                    checked={tempContent.globalStyles.adminButtonFloating}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        globalStyles: {
                          ...prev.globalStyles,
                          adminButtonFloating: e.target.checked,
                        },
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-primary"
                  />
                  <label htmlFor="chk-floating" className="text-xs text-slate-600 dark:text-slate-400">
                    Exibir botão discreto de engrenagem "Admin" no canto inferior esquerdo do site para acesso rápido.
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: AVALIAÇÕES (SUPABASE) */}
        {activeTab === "avaliacoes" && <AvaliacoesManager />}

        {/* ABA: MOMENTOS (SUPABASE) */}
        {activeTab === "momentos" && <MomentosManager />}
      </main>
    </div>
  );
}
