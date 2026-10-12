import React, { useState } from "react";
import { MessageCircle, ZoomIn, Sparkles } from "lucide-react";
import { formatWhatsappAvailabilityLink } from "@/lib/whatsapp";

interface DecorationCardProps {
  id: string;
  nome: string;
  img: string;
  cat: string;
  aspect?: "square" | "portrait" | "tall";
  onZoom: (img: string, nome: string) => void;
  telefone?: string;
}

export function DecorationCard({
  nome,
  img,
  cat,
  aspect = "portrait",
  onZoom,
  telefone,
}: DecorationCardProps) {
  const [imageError, setImageError] = useState(false);
  const whatsappUrl = formatWhatsappAvailabilityLink(nome, telefone);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl">
      {/* ── Imagem principal — proporção fixa para eliminar espaços brancos ── */}
      <div
        className="relative w-full aspect-[4/5] overflow-hidden bg-muted cursor-pointer"
        onClick={() => onZoom(img, nome)}
      >
        {!imageError ? (
          <img
            src={img}
            alt={`Decoração ${nome} - MV Decorações`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          /* Placeholder elegante caso a imagem não carregue */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-secondary via-card to-secondary p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold mb-3 shadow-xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-sm text-foreground line-clamp-1">{nome}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{cat} • MV Decorações</p>
          </div>
        )}

        {/* Badge de Categoria no topo esquerdo */}
        <div className="absolute left-3 top-3 z-10 pointer-events-none">
          <span className="rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md shadow-sm">
            {cat}
          </span>
        </div>

        {/* Botão de Zoom no topo direito (Desktop) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onZoom(img, nome);
          }}
          aria-label={`Ampliar foto de ${nome}`}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-md transition-opacity duration-200 hover:bg-black/80 group-hover:opacity-100"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        {/* Overlay Desktop com nome e botão de consulta */}
        <div
          className="pointer-events-none absolute inset-0 hidden flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 sm:flex"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-white drop-shadow">
            <span className="text-[11px] font-medium uppercase tracking-wider text-amber-300">
              {cat}
            </span>
            <h3 className="font-display font-bold text-base leading-snug">
              {nome}
            </h3>
            <p className="mt-0.5 text-xs text-slate-200">
              MV Decorações • Arapiraca - AL
            </p>
          </div>

          <div className="mt-3.5 flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-500 active:scale-95"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span>Consultar disponibilidade</span>
            </a>

            <button
              type="button"
              onClick={() => onZoom(img, nome)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur transition hover:bg-white/30"
              title="Ampliar foto completa"
              aria-label="Ampliar foto completa"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Rodapé Mobile — visível apenas em telas pequenas ── */}
      <div className="flex flex-col gap-2.5 p-3.5 sm:hidden">
        <div>
          <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1">
            {nome}
          </h3>
          <p className="text-[11px] text-muted-foreground">{cat} • Arapiraca</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white shadow transition hover:bg-emerald-500 active:scale-95"
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Consultar disponibilidade</span>
          </a>

          <button
            type="button"
            onClick={() => onZoom(img, nome)}
            aria-label="Ampliar foto"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border text-foreground hover:bg-secondary transition"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
