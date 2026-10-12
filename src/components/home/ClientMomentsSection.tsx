import React, { useState, useEffect, useCallback } from "react";
import { Camera, Film, PlusCircle, Sparkles, ZoomIn, Play } from "lucide-react";
import { supabase, isSupabaseConfigured, getMediaPublicUrl, type Momento } from "@/lib/supabaseClient";
import { MomentUploadModal } from "./MomentUploadModal";

function MomentCard({
  m,
  onSelect,
}: {
  m: Momento;
  onSelect: (m: Momento) => void;
}) {
  const [loadError, setLoadError] = useState(false);
  const isVideo = m.media_type === "video";
  const url = getMediaPublicUrl(m.media_url, "momentos");

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5 dark:bg-black/30">
        {!loadError ? (
          isVideo ? (
            <div className="relative h-full w-full">
              <video
                src={url}
                playsInline
                controls
                preload="metadata"
                onError={() => {
                  console.warn(`[MV Decorações - Momentos] Erro ao reproduzir vídeo: ${url}`);
                  setLoadError(true);
                }}
                className="block h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                <Film className="h-3 w-3 text-rose-400" />
                <span>Vídeo</span>
              </div>
            </div>
          ) : (
            <div
              className="relative h-full w-full cursor-pointer"
              onClick={() => onSelect({ ...m, media_url: url })}
            >
              <img
                src={url}
                alt={m.legenda || m.nome || "Momento de cliente"}
                loading="lazy"
                onError={() => {
                  console.warn(`[MV Decorações - Momentos] Erro ao carregar imagem: ${url}`);
                  setLoadError(true);
                }}
                className="block h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                <Camera className="h-3 w-3 text-gold" />
                <span>Foto</span>
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-foreground backdrop-blur-sm shadow-md">
                  <ZoomIn className="h-5 w-5" />
                </span>
              </div>
            </div>
          )
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-secondary/50 p-6 text-center text-muted-foreground">
            <Camera className="h-8 w-8 text-gold/40 mb-2" />
            <p className="text-xs font-medium text-foreground">{m.nome || "Momento de cliente"}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Mídia indisponível no momento</p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {m.nome && (
            <p className="font-display text-sm font-bold text-foreground">
              {m.nome}
            </p>
          )}
          {m.legenda && (
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
              "{m.legenda}"
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3 text-[10px] text-muted-foreground">
          <span>MV Decorações • Arapiraca</span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">Verificado</span>
        </div>
      </div>
    </div>
  );
}

export function ClientMomentsSection() {
  const [momentos, setMomentos] = useState<Momento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<Momento | null>(null);

  const carregarMomentos = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("momentos")
        .select("id, nome, legenda, media_url, media_type, aprovado, created_at")
        .eq("aprovado", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setMomentos(data as Momento[]);
      }
    } catch (err) {
      console.error("Erro ao carregar momentos aprovados:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarMomentos();
  }, [carregarMomentos]);

  return (
    <section id="momentos" className="relative scroll-mt-20 bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* Cabeçalho da Seção */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold shadow-sm">
            <Camera className="h-3.5 w-3.5" />
            <span>Galeria de Memórias</span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Momentos dos nossos clientes
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
            Registros reais enviados por famílias que celebraram seus dias especiais com a MV Decorações em Arapiraca e região.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-soft transition hover:opacity-95 active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Compartilhar Meu Momento</span>
            </button>
          </div>
        </div>

        {/* Galeria de Momentos */}
        <div className="mt-12">
          {loading ? (
            /* Skeleton Loading */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-3xl border border-border bg-card p-4 shadow-sm">
                  <div className="aspect-[4/5] w-full rounded-2xl bg-muted" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : momentos.length === 0 ? (
            /* Estado Vazio Acolhedor */
            <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-border bg-card/70 p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Camera className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                Sua festa pode ser o primeiro destaque!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Tirou fotos ou vídeos lindos com a nossa decoração? Envie para nós! Seu registro passará pela nossa aprovação e brilhará nesta vitrine oficial.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-gold bg-card px-6 py-3 text-xs font-bold text-foreground shadow-sm transition hover:bg-gold/10 active:scale-95"
                >
                  <PlusCircle className="h-4 w-4 text-gold" />
                  <span>Enviar Foto ou Vídeo</span>
                </button>
              </div>
            </div>
          ) : (
            /* Grid com Mídias Aprovadas */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {momentos.map((m) => (
                <MomentCard
                  key={m.id}
                  m={m}
                  onSelect={(selected) => setActiveMedia(selected)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Mídia Ampliada (para imagens) */}
      {activeMedia && activeMedia.media_type !== "video" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveMedia(null)}
        >
          <div className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-3xl bg-card p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeMedia.media_url}
              alt={activeMedia.legenda || activeMedia.nome || "Momento ampliado"}
              className="max-h-[75vh] w-full rounded-2xl object-contain"
            />
            <div className="p-4 text-center">
              {activeMedia.nome && <p className="font-display font-semibold text-sm text-foreground">{activeMedia.nome}</p>}
              {activeMedia.legenda && <p className="text-xs text-muted-foreground mt-0.5">"{activeMedia.legenda}"</p>}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Envio com Termos de Consentimento e Moderação */}
      <MomentUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          carregarMomentos();
        }}
      />
    </section>
  );
}
