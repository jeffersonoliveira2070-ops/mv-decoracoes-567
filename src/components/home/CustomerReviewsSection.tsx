import React, { useState, useEffect, useCallback } from "react";
import { Star, MessageSquarePlus, Sparkles, CheckCircle2 } from "lucide-react";
import { supabase, isSupabaseConfigured, type Avaliacao } from "@/lib/supabaseClient";
import { RatingStars } from "./RatingStars";
import { ReviewModal } from "./ReviewModal";

interface CustomerReviewsSectionProps {
  onOpenReviewModal?: () => void;
}

export function CustomerReviewsSection() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carregarAvaliacoes = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("avaliacoes")
        .select("id, nome, nota, comentario, aprovado, created_at")
        .eq("aprovado", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAvaliacoes(data as Avaliacao[]);
      }
    } catch (err) {
      console.error("Erro ao carregar avaliações aprovadas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarAvaliacoes();
  }, [carregarAvaliacoes]);

  // Estatísticas das avaliações aprovadas
  const total = avaliacoes.length;
  const media = total > 0 ? (avaliacoes.reduce((acc, curr) => acc + (curr.nota || 0), 0) / total).toFixed(1) : null;

  return (
    <section id="avaliacoes" className="relative scroll-mt-20 bg-gradient-to-b from-background via-secondary/20 to-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* Cabeçalho da Seção */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Avaliações Reais</span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            O que nossos clientes dizem
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Opiniões autênticas de quem confiou o dia mais especial nas mãos da MV Decorações.
          </p>

          {/* Destaque com média e nota (quando houver dados suficientes) */}
          {total > 0 && media && (
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-border/80 bg-card px-5 py-3 shadow-soft">
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-display text-2xl font-bold text-foreground">{media}</span>
                <span className="text-xs text-muted-foreground">/ 5.0</span>
              </div>
              <span className="text-border" aria-hidden="true">•</span>
              <span className="text-xs font-medium text-muted-foreground">
                Baseado em <strong>{total}</strong> {total === 1 ? "avaliação aprovada" : "avaliações aprovadas"}
              </span>
            </div>
          )}
        </div>

        {/* Conteúdo: Loading, Vazio ou Lista */}
        <div className="mt-12">
          {loading ? (
            /* Skeleton Loading */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-24 rounded bg-muted" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-4/5 rounded bg-muted" />
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="h-3 w-28 rounded bg-muted" />
                    <div className="h-3 w-16 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : total === 0 ? (
            /* Estado Vazio Elegante (sem dados falsos) */
            <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold mb-4">
                <Star className="h-7 w-7 fill-gold/20" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                Seja a primeira pessoa a avaliar!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Já realizou uma festa com a <strong>MV Decorações</strong> em Arapiraca ou região? Sua avaliação é fundamental para nós e ajuda outras famílias a escolherem a melhor decoração.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-soft transition hover:opacity-95 active:scale-95"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  <span>Escrever a Primeira Avaliação</span>
                </button>
              </div>
            </div>
          ) : (
            /* Grid de Avaliações Aprovadas */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {avaliacoes.map((item) => (
                <div
                  key={item.id}
                  className="relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg"
                >
                  <div>
                    {/* Estrelas */}
                    <div className="flex items-center justify-between">
                      <RatingStars value={item.nota} readOnly size="sm" />
                      <span className="text-[11px] font-semibold text-gold">
                        {item.nota}.0 / 5
                      </span>
                    </div>

                    {/* Comentário Real */}
                    <blockquote className="mt-4 text-sm text-foreground/90 leading-relaxed italic">
                      "{item.comentario}"
                    </blockquote>
                  </div>

                  {/* Autor e Data */}
                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {item.nome.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-display text-sm font-semibold text-foreground">
                        {item.nome}
                      </span>
                    </div>

                    <span className="text-[10px] text-muted-foreground">
                      Cliente Verificado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão de Chamada para Ação para Deixar Avaliação */}
        {total > 0 && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-gold/60 bg-card px-6 py-3 text-xs font-bold text-foreground shadow-sm transition hover:bg-gold/10 hover:border-gold active:scale-95"
            >
              <MessageSquarePlus className="h-4 w-4 text-gold" />
              <span>Avaliar Minha Festa com a MV Decorações</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de Avaliação Interativo */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          carregarAvaliacoes();
        }}
      />
    </section>
  );
}
