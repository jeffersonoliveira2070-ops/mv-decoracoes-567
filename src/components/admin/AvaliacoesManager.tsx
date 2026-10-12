import { useState, useEffect, useCallback } from "react";
import {
  supabase,
  isSupabaseConfigured,
  type Avaliacao,
} from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  Star,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  RotateCw,
  AlertTriangle,
  Search,
} from "lucide-react";

export function AvaliacoesManager() {
  const configured = isSupabaseConfigured();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"todas" | "aprovadas" | "pendentes">("todas");
  const [searchTerm, setSearchTerm] = useState("");

  // Formulário de nova avaliação
  const [showForm, setShowForm] = useState(false);
  const [formNome, setFormNome] = useState("");
  const [formComentario, setFormComentario] = useState("");
  const [formNota, setFormNota] = useState(5);
  const [formAprovado, setFormAprovado] = useState(true);
  const [saving, setSaving] = useState(false);

  const carregarAvaliacoes = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("avaliacoes")
        .select("id, nome, nota, comentario, aprovado, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(`Erro ao carregar avaliações: ${error.message}`);
      } else if (data) {
        setAvaliacoes(data as Avaliacao[]);
      }
    } catch (err: any) {
      toast.error(`Falha na conexão com Supabase: ${err?.message || "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    if (configured) {
      carregarAvaliacoes();
    }
  }, [configured, carregarAvaliacoes]);

  const toggleAprovado = async (item: Avaliacao) => {
    const novoStatus = !item.aprovado;
    const { error } = await supabase
      .from("avaliacoes")
      .update({ aprovado: novoStatus })
      .eq("id", item.id);

    if (error) {
      toast.error(`Erro ao atualizar: ${error.message}`);
    } else {
      toast.success(novoStatus ? "Avaliação aprovada com sucesso!" : "Avaliação ocultada!");
      setAvaliacoes((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, aprovado: novoStatus } : a)),
      );
    }
  };

  const handleExcluir = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente excluir a avaliação de "${nome}"?`)) return;

    const { error } = await supabase.from("avaliacoes").delete().eq("id", id);
    if (error) {
      toast.error(`Erro ao excluir: ${error.message}`);
    } else {
      toast.success("Avaliação excluída!");
      setAvaliacoes((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSalvarNova = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome.trim() || !formComentario.trim()) {
      toast.error("Preencha o nome e o comentário.");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("avaliacoes")
        .insert([
          {
            nome: formNome.trim(),
            nota: formNota,
            comentario: formComentario.trim(),
            aprovado: formAprovado,
          },
        ])
        .select("id, nome, nota, comentario, aprovado, created_at");

      if (error) {
        toast.error(`Erro ao salvar: ${error.message}`);
      } else {
        toast.success("Avaliação cadastrada com sucesso!");
        if (data && data[0]) {
          setAvaliacoes((prev) => [data[0] as Avaliacao, ...prev]);
        } else {
          carregarAvaliacoes();
        }
        setShowForm(false);
        setFormNome("");
        setFormComentario("");
        setFormNota(5);
        setFormAprovado(true);
      }
    } catch (err: any) {
      toast.error(`Erro: ${err?.message || "Falha ao salvar"}`);
    } finally {
      setSaving(false);
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
              Para gerenciar a tabela <code className="font-mono font-bold">public.avaliacoes</code>, informe suas credenciais do Supabase no arquivo <code className="font-mono font-bold">.env.local</code>:
            </p>
            <pre className="rounded-lg bg-black/10 p-3 text-xs font-mono dark:bg-black/30">
              VITE_SUPABASE_URL=https://seu-projeto.supabase.co&#10;VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
            </pre>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              A tabela <code className="font-mono">public.avaliacoes</code> utiliza as colunas: id, nome, nota, comentario, aprovado e created_at.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const itensFiltrados = avaliacoes
    .filter((a) => {
      if (filter === "aprovadas") return a.aprovado;
      if (filter === "pendentes") return !a.aprovado;
      return true;
    })
    .filter((a) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        a.nome.toLowerCase().includes(term) ||
        (a.comentario && a.comentario.toLowerCase().includes(term))
      );
    });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Avaliações dos Clientes</h2>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              Supabase • RLS Ativo
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Gerencie as avaliações da tabela <code className="font-mono">public.avaliacoes</code> (nome, nota, comentario, aprovado).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => carregarAvaliacoes()}
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
            <Plus className="h-4 w-4" /> {showForm ? "Fechar Formulário" : "Nova Avaliação"}
          </button>
        </div>
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <form
          onSubmit={handleSalvarNova}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4"
        >
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Adicionar Avaliação Manual</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold">Nome do Cliente *</label>
              <input
                type="text"
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                placeholder="Ex: Maria Clara"
                required
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold">Nota (1 a 5 estrelas)</label>
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setFormNota(s)}
                    className="p-1 text-amber-400 hover:scale-110 transition"
                  >
                    <Star
                      className={`h-6 w-6 ${s <= formNota ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                    />
                  </button>
                ))}
                <span className="text-xs font-medium text-slate-500 ml-2">({formNota} de 5)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold">Comentário do Cliente *</label>
            <textarea
              rows={3}
              value={formComentario}
              onChange={(e) => setFormComentario(e.target.value)}
              placeholder="Ex: A decoração ficou linda! Chegou tudo impecável e no horário combinado."
              required
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
              <input
                type="checkbox"
                checked={formAprovado}
                onChange={(e) => setFormAprovado(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary"
              />
              Aprovar imediatamente (visível no site)
            </label>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 disabled:opacity-50"
            >
              {saving ? "Salvando no Supabase..." : "Salvar Avaliação"}
            </button>
          </div>
        </form>
      )}

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 text-xs font-medium dark:border-slate-800 dark:bg-slate-900">
          {(
            [
              { id: "todas", label: `Todas (${avaliacoes.length})` },
              { id: "aprovadas", label: `Aprovadas (${avaliacoes.filter((a) => a.aprovado).length})` },
              { id: "pendentes", label: `Pendentes/Ocultas (${avaliacoes.filter((a) => !a.aprovado).length})` },
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
            placeholder="Buscar por nome ou comentário..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Lista de Avaliações */}
      {loading && avaliacoes.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">
          <RotateCw className="mx-auto h-6 w-6 animate-spin mb-2" />
          Carregando avaliações do Supabase...
        </div>
      ) : itensFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500 dark:border-slate-800">
          Nenhuma avaliação encontrada neste filtro.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itensFiltrados.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition shadow-sm bg-white dark:bg-slate-900 ${
                item.aprovado
                  ? "border-emerald-200 dark:border-emerald-950"
                  : "border-amber-200 bg-amber-50/20 dark:border-amber-950"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm dark:bg-primary/20">
                      {item.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.nome}</h4>
                      <p className="text-[10px] text-slate-400">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString("pt-BR") : "Data não reg."}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1 ${
                      item.aprovado
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                    }`}
                  >
                    {item.aprovado ? (
                      <>
                        <CheckCircle className="h-3 w-3" /> Aprovada
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" /> Oculta
                      </>
                    )}
                  </span>
                </div>

                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < item.nota ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  ))}
                  <span className="ml-1.5 text-[11px] font-medium text-slate-500">
                    {item.nota}/5
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 italic line-clamp-4 leading-relaxed">
                  "{item.comentario}"
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
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
                  onClick={() => handleExcluir(item.id, item.nome)}
                  title="Excluir avaliação"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
