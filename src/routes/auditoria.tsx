import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useCallback, useEffect } from "react";
import { fotos, type Cat } from "@/assets/photos";
import {
  ArrowLeft,
  Search,
  Save,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  Filter,
  Download,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

// ─── Guard: apenas em desenvolvimento ────────────────────────────────────────
function DevOnlyGuard({ children }: { children: React.ReactNode }) {
  if (!import.meta.env.DEV) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center space-y-3">
          <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto" />
          <h1 className="text-2xl font-bold">Página indisponível</h1>
          <p className="text-gray-400">Esta página só está disponível no ambiente de desenvolvimento.</p>
          <Link to="/" className="inline-block mt-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

// ─── Tipos ────────────────────────────────────────────────────────────────────
type EditableItem = {
  n: number;
  img: string;
  cat: Cat;
  nome: string;
  originalNome: string;
  originalCat: Cat;
};

const CATEGORIAS: Cat[] = ["Infantil", "Bebê & Mesversário", "Esportes", "Adulto"];
// v2: nomes e categorias definitivos vêm de src/assets/photos.ts.
const STORAGE_KEY = "mv_auditoria_fotos_draft_v2";
const LEGACY_STORAGE_KEY = "mv_auditoria_fotos_draft_v1";

// Rascunhos antigos (v1) guardavam nomes superados; removidos para que não
// sobrescrevam os valores definitivos do catálogo.
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // storage indisponível
  }
}

// ─── Rota ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/auditoria")({
  head: () => ({
    meta: [{ title: "Auditoria de Fotos [DEV] | MV Decorações" }],
  }),
  component: AuditoriaPage,
});

function AuditoriaPage() {
  return (
    <DevOnlyGuard>
      <AuditoriaContent />
    </DevOnlyGuard>
  );
}

function AuditoriaContent() {
  // Inicializa a partir de fotos + rascunho salvo no localStorage
  const [items, setItems] = useState<EditableItem[]>(() => {
    let savedDraft: Record<number, { nome?: string; cat?: Cat }> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) savedDraft = JSON.parse(raw);
    } catch {
      // Ignora erro de JSON
    }

    return fotos.map((f) => {
      const originalNome = (f as any).nome ?? `Decoração ${f.cat} #${f.n}`;
      const originalCat = f.cat as Cat;
      const draft = savedDraft[f.n];

      return {
        n: f.n,
        img: f.img,
        cat: (draft?.cat && CATEGORIAS.includes(draft.cat) ? draft.cat : originalCat) as Cat,
        nome: draft?.nome !== undefined ? draft.nome : originalNome,
        originalNome,
        originalCat,
      };
    });
  });

  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("Todas");
  const [showDiff, setShowDiff] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedCode, setSavedCode] = useState<string | null>(null);

  // Itens com alterações em relação ao original de fotos.ts
  const alterados = useMemo(
    () => items.filter((i) => i.nome !== i.originalNome || i.cat !== i.originalCat),
    [items]
  );

  // Sincroniza rascunho com localStorage
  useEffect(() => {
    if (alterados.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const draft: Record<number, { nome: string; cat: Cat }> = {};
    for (const item of alterados) {
      draft[item.n] = { nome: item.nome, cat: item.cat };
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Quota excedida ou storage indisponível
    }
  }, [alterados]);

  // Filtragem
  const visiveis = useMemo(() => {
    return items.filter((item) => {
      const matchBusca =
        busca.trim() === "" ||
        item.nome.toLowerCase().includes(busca.toLowerCase()) ||
        `foto-${String(item.n).padStart(2, "0")}`.includes(busca.toLowerCase()) ||
        String(item.n) === busca.trim();
      const matchCat = filtroCategoria === "Todas" || item.cat === filtroCategoria;
      return matchBusca && matchCat;
    });
  }, [items, busca, filtroCategoria]);

  // Atualizar campo de item
  const updateItem = useCallback((n: number, field: "nome" | "cat", value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.n === n ? { ...item, [field]: value } : item))
    );
  }, []);

  // Restaurar item individual
  const resetItem = useCallback((n: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.n === n
          ? { ...item, nome: item.originalNome, cat: item.originalCat }
          : item
      )
    );
    toast.info(`Foto #${n} restaurada`);
  }, []);

  // Restaurar todas as fotos
  const resetAll = useCallback(() => {
    if (!window.confirm("Deseja descartar todas as alterações e restaurar os nomes originais?")) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    setItems(
      fotos.map((f) => ({
        n: f.n,
        img: f.img,
        cat: f.cat as Cat,
        nome: (f as any).nome ?? `Decoração ${f.cat} #${f.n}`,
        originalNome: (f as any).nome ?? `Decoração ${f.cat} #${f.n}`,
        originalCat: f.cat as Cat,
      }))
    );
    setShowDiff(false);
    setSavedCode(null);
    toast.success("Todas as alterações foram descartadas.");
  }, []);

  // Gerar código TypeScript corrigido
  const gerarCodigo = useCallback(() => {
    const nomesLines = items
      .map((i) => `  ${i.n}: "${i.nome.replace(/"/g, '\\"')}",`)
      .join("\n");
    const catsLines = items
      .map((i) => `  ${i.n}: "${i.cat}",`)
      .join("\n");

    return `// ──── COLE EM src/assets/photos.ts ────────────────────────────────

export const nomesPorFoto: Record<number, string> = {
${nomesLines}
};

const cats: Record<number, Cat> = {
${catsLines}
};`;
  }, [items]);

  // Copiar código gerado
  const copiarCodigo = useCallback(async () => {
    const codigo = gerarCodigo();
    setSavedCode(codigo);
    try {
      await navigator.clipboard.writeText(codigo);
      setCopied(true);
      toast.success("Código copiado! Cole em src/assets/photos.ts");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.info("Código gerado no painel abaixo.");
    }
  }, [gerarCodigo]);

  // Baixar JSON com os nomes e categorias
  const baixarJson = useCallback(() => {
    const exportData = {
      geradoEm: new Date().toISOString(),
      totalFotos: items.length,
      alteracoes: alterados.map((i) => ({
        n: i.n,
        arquivo: `foto-${String(i.n).padStart(2, "0")}.jpg`,
        nomeAnterior: i.originalNome,
        nomeNovo: i.nome,
        categoriaAnterior: i.originalCat,
        categoriaNova: i.cat,
      })),
      todasFotos: items.map((i) => ({
        n: i.n,
        arquivo: `foto-${String(i.n).padStart(2, "0")}.jpg`,
        nome: i.nome,
        cat: i.cat,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mv-decoracoes-auditoria-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Arquivo JSON baixado com sucesso!");
  }, [items, alterados]);

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-amber-500 selection:text-black">
      {/* ── Cabeçalho ── */}
      <header className="sticky top-0 z-30 bg-gray-900/95 border-b border-gray-800 backdrop-blur-sm shadow-md">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition px-2 py-1 rounded-md hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Ver Site
            </Link>
            <span className="text-gray-700">|</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white leading-tight">
                  Auditoria Visual da Galeria
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DEV MODE
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Visualize as 45 decorações, corrija nomes e categorias e exporte as alterações.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {alterados.length > 0 ? (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {alterados.length} {alterados.length === 1 ? "alteração salva" : "alterações salvas"} (local)
              </span>
            ) : (
              <span className="text-xs text-gray-500 hidden sm:inline">
                Nenhuma alteração pendente
              </span>
            )}

            <button
              onClick={() => setShowDiff((v) => !v)}
              disabled={alterados.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/40 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Comparar antes e depois das alterações"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Diff ({alterados.length})
            </button>

            <button
              onClick={baixarJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/40 transition"
              title="Baixar arquivo JSON com todas as decorações e alterações"
            >
              <Download className="h-3.5 w-3.5" />
              Baixar JSON
            </button>

            <button
              onClick={copiarCodigo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/40 transition"
              title="Gerar e copiar código TypeScript para src/assets/photos.ts"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copiado!" : "Copiar Código"}
            </button>

            {alterados.length > 0 && (
              <button
                onClick={resetAll}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition"
                title="Descartar todas as alterações"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Descartar
              </button>
            )}
          </div>
        </div>

        {/* Barra de busca e filtros */}
        <div className="max-w-screen-2xl mx-auto px-4 pb-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nome, foto-01 ou número..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="h-3.5 w-3.5 text-gray-500 mr-1" />
            {["Todas", ...CATEGORIAS].map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                  filtroCategoria === cat
                    ? "bg-amber-500 text-black font-semibold shadow-sm"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="ml-auto text-xs text-gray-500">
            Exibindo <strong>{visiveis.length}</strong> de {items.length} decorações
          </span>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 py-6">

        {/* ── Painel de Diff ── */}
        {showDiff && alterados.length > 0 && (
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 overflow-hidden animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/20 bg-amber-500/10">
              <h2 className="font-semibold text-amber-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {alterados.length} {alterados.length === 1 ? "alteração pendente" : "alterações pendentes"}
              </h2>
              <button
                onClick={() => setShowDiff(false)}
                className="text-xs text-gray-400 hover:text-white transition px-2 py-1 rounded hover:bg-white/10"
              >
                ✕ Fechar
              </button>
            </div>
            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800 bg-gray-900/50">
                    <th className="px-4 py-2 text-left">Foto</th>
                    <th className="px-4 py-2 text-left">Nome anterior</th>
                    <th className="px-4 py-2 text-left">Nome novo</th>
                    <th className="px-4 py-2 text-left">Cat. anterior</th>
                    <th className="px-4 py-2 text-left">Cat. nova</th>
                  </tr>
                </thead>
                <tbody>
                  {alterados.map((item) => (
                    <tr key={item.n} className="border-b border-gray-800/50 hover:bg-white/5 transition">
                      <td className="px-4 py-2 font-mono text-xs text-amber-300 font-semibold">
                        foto-{String(item.n).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-2 text-red-400/80 line-through text-xs">{item.originalNome}</td>
                      <td className="px-4 py-2 text-emerald-400 font-medium text-xs">{item.nome}</td>
                      <td className="px-4 py-2 text-red-400/70 text-xs line-through">
                        {item.cat !== item.originalCat ? item.originalCat : "—"}
                      </td>
                      <td className="px-4 py-2 text-emerald-400/80 text-xs font-semibold">
                        {item.cat !== item.originalCat ? item.cat : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 text-xs text-gray-400 border-t border-gray-800 flex items-center justify-between gap-4">
              <span>
                As alterações ficam salvas automaticamente neste navegador via LocalStorage.
              </span>
              <button
                onClick={copiarCodigo}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Copiar código TypeScript →
              </button>
            </div>
          </div>
        )}

        {/* ── Código gerado ── */}
        {savedCode && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-500/20 bg-emerald-500/10">
              <h2 className="font-semibold text-emerald-300 flex items-center gap-2">
                <Save className="h-4 w-4" />
                Código gerado — cole em <code className="text-white text-xs bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">src/assets/photos.ts</code>
              </h2>
              <button
                onClick={() => setSavedCode(null)}
                className="text-xs text-gray-400 hover:text-white transition px-2 py-1 rounded hover:bg-white/10"
              >
                ✕ Fechar
              </button>
            </div>
            <pre className="p-4 text-xs text-gray-300 overflow-x-auto leading-relaxed font-mono max-h-80 bg-gray-950/70">
              {savedCode}
            </pre>
          </div>
        )}

        {/* ── Grade de Fotos ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {visiveis.map((item) => {
            const changed = item.nome !== item.originalNome || item.cat !== item.originalCat;
            const fotoId = `foto-${String(item.n).padStart(2, "0")}`;
            return (
              <PhotoCard
                key={item.n}
                item={item}
                fotoId={fotoId}
                changed={changed}
                onUpdateNome={(v) => updateItem(item.n, "nome", v)}
                onUpdateCat={(v) => updateItem(item.n, "cat", v as Cat)}
                onReset={() => resetItem(item.n)}
              />
            );
          })}
        </div>

        {visiveis.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhuma foto encontrada para os filtros aplicados.</p>
            <button
              onClick={() => {
                setBusca("");
                setFiltroCategoria("Todas");
              }}
              className="mt-3 text-xs text-amber-400 hover:underline"
            >
              Limpar busca e filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Card individual ─────────────────────────────────────────────────────────
function PhotoCard({
  item,
  fotoId,
  changed,
  onUpdateNome,
  onUpdateCat,
  onReset,
}: {
  item: EditableItem;
  fotoId: string;
  changed: boolean;
  onUpdateNome: (v: string) => void;
  onUpdateCat: (v: string) => void;
  onReset: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div
        className={`group rounded-2xl overflow-hidden bg-gray-900 border transition-all flex flex-col ${
          changed
            ? "border-amber-500/60 ring-2 ring-amber-500/20 shadow-lg shadow-amber-500/10"
            : "border-gray-800 hover:border-gray-700"
        }`}
      >
        {/* Imagem */}
        <div
          className="relative aspect-[3/4] bg-gray-800 cursor-zoom-in overflow-hidden"
          onClick={() => setLightbox(true)}
          title="Clique para ampliar a imagem"
        >
          {!imgError ? (
            <img
              src={item.img}
              alt={item.nome}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-xs text-center p-3">
              <span className="text-gray-400 font-semibold mb-1">{fotoId}</span>
              <span>Imagem não carregada</span>
            </div>
          )}

          {/* Badge número */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-white text-[11px] font-mono font-bold backdrop-blur-sm border border-white/10">
            {fotoId}
          </div>

          {/* Badge alterado */}
          {changed && (
            <div
              className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black shadow-md flex items-center gap-1"
              title="Este card possui modificações não salvas no código"
            >
              MODIFICADO
            </div>
          )}

          {/* Hint de zoom no hover */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
            🔍 Ampliar
          </div>
        </div>

        {/* Campos editáveis */}
        <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div>
              <label className="text-[10px] uppercase font-semibold tracking-wider text-gray-500 block mb-0.5">
                Nome do Tema
              </label>
              <input
                type="text"
                value={item.nome}
                onChange={(e) => onUpdateNome(e.target.value)}
                className={`w-full px-2 py-1.5 rounded-lg text-xs bg-gray-800 border text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition font-medium ${
                  item.nome !== item.originalNome
                    ? "border-amber-500/80 bg-amber-500/10 focus:border-amber-400 focus:ring-amber-400/30"
                    : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/30"
                }`}
                placeholder="Ex: Homem-Aranha"
                title={`Editar nome de ${fotoId}`}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-semibold tracking-wider text-gray-500 block mb-0.5">
                Categoria
              </label>
              <select
                value={item.cat}
                onChange={(e) => onUpdateCat(e.target.value)}
                className={`w-full px-2 py-1.5 rounded-lg text-xs bg-gray-800 border text-gray-200 focus:outline-none focus:ring-1 transition ${
                  item.cat !== item.originalCat
                    ? "border-amber-500/80 bg-amber-500/10 focus:border-amber-400 focus:ring-amber-400/30"
                    : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/30"
                }`}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-1">
            {changed ? (
              <div className="space-y-1">
                <button
                  onClick={onReset}
                  className="w-full flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition font-medium"
                >
                  <RotateCcw className="h-3 w-3" />
                  Restaurar original
                </button>
                <div className="text-[10px] text-gray-500 truncate" title={`Antes: ${item.originalNome}`}>
                  De: <span className="line-through">{item.originalNome}</span>
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-gray-500 truncate px-0.5" title={item.originalNome}>
                {item.originalNome}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / Visualização Ampliada */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLightbox(false)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between text-white">
              <span className="font-mono text-sm text-amber-400 font-bold">{fotoId}</span>
              <button
                onClick={() => setLightbox(false)}
                className="text-gray-400 hover:text-white text-sm transition px-2 py-1 rounded hover:bg-white/10"
              >
                ✕ Fechar (Esc)
              </button>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 shadow-2xl">
              <img
                src={item.img}
                alt={item.nome}
                className="w-full max-h-[75vh] object-contain mx-auto"
                onError={() => setImgError(true)}
              />
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-white text-base font-semibold">{item.nome}</h3>
              <p className="text-amber-400/90 text-xs font-medium mt-0.5">Categoria: {item.cat}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
