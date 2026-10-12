import React, { useState, useEffect } from "react";
import { X, Sparkles, CheckCircle2 } from "lucide-react";
import { RatingStars } from "./RatingStars";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const [nome, setNome] = useState("");
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSucesso(false);
      setNome("");
      setNota(5);
      setComentario("");
      setEnviando(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error("Por favor, informe seu nome.");
      return;
    }
    if (nota < 1 || nota > 5) {
      toast.error("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    if (!comentario.trim()) {
      toast.error("Por favor, escreva um breve comentário sobre a sua experiência.");
      return;
    }

    setEnviando(true);

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from("avaliacoes").insert([
          {
            nome: nome.trim(),
            nota,
            comentario: comentario.trim(),
            aprovado: false, // Inicia pendente para aprovação do administrador
          },
        ]);

        if (error) {
          toast.error(`Não foi possível enviar a avaliação: ${error.message}`);
          setEnviando(false);
          return;
        }
      }

      setSucesso(true);
      toast.success("Avaliação enviada com sucesso!");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(`Erro ao enviar: ${err?.message || "Tente novamente."}`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          aria-label="Fechar janela"
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {sucesso ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Muito obrigado pela sua avaliação!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Seu depoimento foi recebido com sucesso e será exibido no site após a moderação do administrador. Agradecemos pelo carinho e confiança!
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-gold">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Sua opinião é valiosa
                </span>
              </div>
              <h2
                id="review-modal-title"
                className="mt-1 text-2xl font-bold font-display text-slate-900 dark:text-white"
              >
                Avaliar a MV Decorações
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Conte-nos como foi a decoração e o atendimento da sua festa.
              </p>
            </div>

            {/* Estrelas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Qual nota você dá para o nosso trabalho? *
              </label>
              <RatingStars value={nota} onChange={setNota} size="lg" showLabel />
            </div>

            {/* Nome */}
            <div>
              <label
                htmlFor="review-nome"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Seu Nome *
              </label>
              <input
                id="review-nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Ana Clara, Família Santos..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-800/80 dark:focus:border-primary"
              />
            </div>

            {/* Comentário */}
            <div>
              <label
                htmlFor="review-comentario"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Seu Comentário *
              </label>
              <textarea
                id="review-comentario"
                required
                rows={4}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Conte sobre os detalhes da festa, pontualidade, atendimento e o resultado da decoração..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-800/80 dark:focus:border-primary"
              />
            </div>

            <p className="text-[11px] text-slate-400">
              * Sua avaliação passará por moderação da equipe antes de ficar visível publicamente no site.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={enviando}
                className="rounded-full px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando || !nome.trim() || !comentario.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-bold text-white shadow-soft transition hover:opacity-95 disabled:opacity-50"
              >
                {enviando ? "Enviando..." : "Publicar Avaliação"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
