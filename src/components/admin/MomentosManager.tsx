import { useState, useEffect, useCallback } from "react";
import {
  supabase,
  isSupabaseConfigured,
  uploadMediaToStorage,
  getMediaPublicUrl,
  type Momento,
} from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  Camera,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  RotateCw,
  AlertTriangle,
  Upload,
  Film,
  Image as ImageIcon,
  Edit2,
  Check,
  X,
  Search,
} from "lucide-react";
import { readFileAsDataUrl } from "@/lib/contentStore";

export function MomentosManager() {
  const configured = isSupabaseConfigured();
  const [momentos, setMomentos] = useState<Momento[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"todos" | "aprovados" | "pendentes">("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Form de criação
  const [showForm, setShowForm] = useState(false);
  const [formNome, setFormNome] = useState("");
  const [formLegenda, setFormLegenda] = useState("");
  const [formMediaUrl, setFormMediaUrl] = useState("");
  const [formMediaType, setFormMediaType] = useState<"imagem" | "video">("imagem");
  const [formAprovado, setFormAprovado] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Edição rápida
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editLegenda, setEditLegenda] = useState("");

  const carregarMomentos = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("momentos")
        .select("id, nome, legenda, media_url, media_type, aprovado, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(`Erro ao carregar momentos: ${error.message}`);
      } else if (data) {
        setMomentos(data as Momento[]);
      }
    } catch (err: any) {
      toast.error(`Falha ao conectar com Supabase: ${err?.message || "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    if (configured) {
      carregarMomentos();
    }
  }, [configured, carregarMomentos]);

  const toggleAprovado = async (item: Momento) => {
    const novoStatus = !item.aprovado;
    const { error } = await supabase
      .from("momentos")
      .update({ aprovado: novoStatus })
      .eq("id", item.id);

    if (error) {
      toast.error(`Erro ao atualizar: ${error.message}`);
    } else {
      toast.success(novoStatus ? "Momento aprovado e visível!" : "Momento ocultado!");
      setMomentos((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, aprovado: novoStatus } : m)),
      );
    }
  };

  const handleExcluir = async (id: string, nome: string | null) => {
    if (!confirm(`Deseja excluir o momento "${nome || "sem nome"}"?`)) return;

    const { error } = await supabase.from("momentos").delete().eq("id", id);
    if (error) {
      toast.error(`Erro ao excluir: ${error.message}`);
    } else {
      toast.success("Momento excluído com sucesso!");
      setMomentos((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleSalvarNovo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMediaUrl.trim()) {
      toast.error("Informe a URL da imagem ou vídeo.");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("momentos")
        .insert([
          {
            nome: formNome.trim() || null,
            legenda: formLegenda.trim() || null,
            media_url: formMediaUrl.trim(),
            media_type: formMediaType,
            aprovado: formAprovado,
          },
        ])
        .select("id, nome, legenda, media_url, media_type, aprovado, created_at");

      if (error) {
        toast.error(`Erro ao salvar: ${error.message}`);
      } else {
        toast.success("Momento cadastrado com sucesso!");
        if (data && data[0]) {
          setMomentos((prev) => [data[0] as Momento, ...prev]);
        } else {
          carregarMomentos();
        }
        setShowForm(false);
        setFormNome("");
        setFormLegenda("");
        setFormMediaUrl("");
        setFormMediaType("imagem");
        setFormAprovado(true);
      }
    } catch (err: any) {
      toast.error(`Erro: ${err?.message || "Falha ao salvar"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadMidia = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = formMediaType === "video" ? "video/*" : "image/*";
    input.onchange = async (ev) => {
      const target = ev.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      setUploading(true);
      toast.info("Enviando arquivo...");

      // Tenta upload direto para o bucket do Supabase Storage
      const storageResult = await uploadMediaToStorage(file, "momentos");
      if (storageResult.url) {
        setFormMediaUrl(storageResult.url);
        toast.success("Arquivo enviado com sucesso para o Supabase Storage!");
      } else {
        // Fallback para Data URL se o bucket não estiver acessível
        try {
          const fallbackDataUrl = await readFileAsDataUrl(file);
          setFormMediaUrl(fallbackDataUrl);
          toast.warning("Bucket indisponível. Carregado localmente via Data URL.");
        } catch {
          toast.error(storageResult.error || "Erro ao carregar arquivo.");
        }
      }
      setUploading(false);
    };
    input.click();
  };

  const handleSalvarEdicao = async (id: string) => {
    const { error } = await supabase
      .from("momentos")
      .update({
        nome: editNome.trim() || null,
        legenda: editLegenda.trim() || null,
      })
      .eq("id", id);

    if (error) {
      toast.error(`Erro ao atualizar: ${error.message}`);
    } else {
      toast.success("Momento atualizado!");
      setMomentos((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, nome: editNome, legenda: editLegenda } : m,
        ),
      );
      setEditingId(null);
    }
  };

  if (!configured) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-semibold text-base">Supabase não configurado</h3>
            <p className="text-sm">
              Para gerenciar a tabela <code className="font-mono font-bold">public.momentos</code>, informe suas credenciais do Supabase no arquivo <code className="font-mono font-bold">.env.local</code>:
            </p>
            <pre className="rounded-lg bg-black/10 p-3 text-xs font-mono dark:bg-black/30">
              VITE_SUPABASE_URL=https://seu-projeto.supabase.co&#10;VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
            </pre>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              A tabela <code className="font-mono">public.momentos</code> utiliza as colunas: id, nome, legenda, media_url, media_type, aprovado e created_at.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const itensFiltrados = momentos
    .filter((m) => {
      if (filter === "aprovados") return m.aprovado;
      if (filter === "pendentes") return !m.aprovado;
      return true;
    })
    .filter((m) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        (m.nome && m.nome.toLowerCase().includes(term)) ||
        (m.legenda && m.legenda.toLowerCase().includes(term))
      );
    });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Momentos & Destaques</h2>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              Supabase • RLS Ativo
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Gerencie fotos e vídeos da tabela <code className="font-mono">public.momentos</code> (nome, legenda, media_url, media_type, aprovado).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => carregarMomentos()}
            disabled={loading}
            title="Atualizar lista"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Atualizar
          </button>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> {showForm ? "Fechar Formulário" : "Novo Momento"}
          </button>
        </div>
      </div>

      {/* Formulário de Criação */}
      {showForm && (
        <form
          onSubmit={handleSalvarNovo}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4"
        >
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Adicionar Novo Momento</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold">Nome / Título (opcional)</label>
              <input
                type="text"
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                placeholder="Ex: Aniversário Tema Jardim Encantado"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold">Tipo de Mídia (media_type)</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormMediaType("imagem")}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                    formMediaType === "imagem"
                      ? "border-primary bg-primary/10 text-primary dark:bg-primary/20"
                      : "border-slate-300 dark:border-slate-700 text-slate-600"
                  }`}
                >
                  <ImageIcon className="h-4 w-4" /> Imagem
                </button>
                <button
                  type="button"
                  onClick={() => setFormMediaType("video")}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                    formMediaType === "video"
                      ? "border-primary bg-primary/10 text-primary dark:bg-primary/20"
                      : "border-slate-300 dark:border-slate-700 text-slate-600"
                  }`}
                >
                  <Film className="h-4 w-4" /> Vídeo
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold">URL da Mídia (media_url) *</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formMediaUrl}
                onChange={(e) => setFormMediaUrl(e.target.value)}
                placeholder={
                  formMediaType === "video"
                    ? "URL do vídeo MP4 ou envie para o storage..."
                    : "URL da imagem ou envie para o storage..."
                }
                required
                className="flex-1 rounded-xl border border-slate-300 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
              <button
                type="button"
                onClick={handleUploadMidia}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-100 px-3 py-2.5 text-xs font-medium hover:bg-slate-200 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800"
              >
                <Upload className="h-4 w-4" /> {uploading ? "Enviando..." : "Upload Storage"}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold">Legenda / Descrição (opcional)</label>
            <textarea
              rows={2}
              value={formLegenda}
              onChange={(e) => setFormLegenda(e.target.value)}
              placeholder="Ex: Decoração personalizada com mesa principal, flores e iluminação especial."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
              <input
                type="checkbox"
                checked={formAprovado}
                onChange={(e) => setFormAprovado(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary"
              />
              Aprovar imediatamente (visível para os clientes)
            </label>

            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 disabled:opacity-50"
            >
              {saving ? "Salvando no Supabase..." : "Salvar Momento"}
            </button>
          </div>
        </form>
      )}

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 text-xs font-medium dark:border-slate-800 dark:bg-slate-900">
          {(
            [
              { id: "todos", label: `Todos (${momentos.length})` },
              { id: "aprovados", label: `Aprovados (${momentos.filter((m) => m.aprovado).length})` },
              { id: "pendentes", label: `Pendentes/Ocultos (${momentos.filter((m) => !m.aprovado).length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`rounded-lg px-3 py-1.5 transition ${
                filter === t.id
                  ? "bg-primary text-white font-semibold"
                  : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou legenda..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Lista de Momentos */}
      {loading && momentos.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">
          <RotateCw className="mx-auto h-6 w-6 animate-spin mb-2" />
          Carregando momentos do Supabase...
        </div>
      ) : itensFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500 dark:border-slate-800">
          Nenhum momento encontrado neste filtro.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itensFiltrados.map((item) => {
            const isEditing = editingId === item.id;
            const isVideo = item.media_type === "video";
            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition dark:bg-slate-900 ${
                  item.aprovado
                    ? "border-slate-200 dark:border-slate-800"
                    : "border-amber-200 opacity-70 bg-amber-50/10 dark:border-amber-950"
                }`}
              >
                {/* Mídia Preview */}
                <div className="relative aspect-video w-full bg-slate-950">
                  {(() => {
                    const mediaSrc = getMediaPublicUrl(item.media_url, "momentos");
                    return isVideo ? (
                      <video
                        src={mediaSrc}
                        controls
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={mediaSrc}
                        alt={item.nome || "Momento"}
                        onError={(e) => {
                          console.warn(`[MomentosManager] Erro ao carregar: ${mediaSrc}`);
                        }}
                        className="h-full w-full object-cover"
                      />
                    );
                  })()}

                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur flex items-center gap-1">
                      {isVideo ? <Film className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
                      {item.media_type}
                    </span>
                  </div>

                  <span
                    className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur flex items-center gap-1 ${
                      item.aprovado
                        ? "bg-emerald-600/90 text-white"
                        : "bg-amber-600/90 text-white"
                    }`}
                  >
                    {item.aprovado ? (
                      <>
                        <CheckCircle className="h-3 w-3" /> Aprovado
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" /> Oculto
                      </>
                    )}
                  </span>
                </div>

                {/* Conteúdo & Edição */}
                <div className="p-4 space-y-3">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editNome}
                        onChange={(e) => setEditNome(e.target.value)}
                        placeholder="Nome do momento"
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                      />
                      <textarea
                        rows={2}
                        value={editLegenda}
                        onChange={(e) => setEditLegenda(e.target.value)}
                        placeholder="Legenda"
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                        >
                          <X className="h-3 w-3" /> Cancelar
                        </button>
                        <button
                          onClick={() => handleSalvarEdicao(item.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
                        >
                          <Check className="h-3 w-3" /> Salvar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.nome || <span className="text-slate-400 italic">Sem nome</span>}
                      </h4>
                      {item.legenda && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {item.legenda}
                        </p>
                      )}
                      <p className="mt-2 text-[10px] text-slate-400">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString("pt-BR") : "Data não reg."}
                      </p>
                    </div>
                  )}

                  {/* Ações inferiores */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAprovado(item)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          item.aprovado
                            ? "bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800 dark:bg-slate-800 dark:text-slate-300"
                            : "bg-emerald-600 text-white hover:bg-emerald-500"
                        }`}
                      >
                        {item.aprovado ? "Ocultar" : "Aprovar"}
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditNome(item.nome || "");
                          setEditLegenda(item.legenda || "");
                        }}
                        title="Editar nome e legenda"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleExcluir(item.id, item.nome)}
                      title="Excluir momento"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
