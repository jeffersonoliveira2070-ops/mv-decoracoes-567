import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useEffect, useState, type FormEvent } from "react";
import {
  Palette, MessageCircle, Truck, PackageCheck, Clock, Sparkles, Hammer, Heart,
  Star, Instagram, Phone, MapPin, Menu, X, ChevronLeft, ChevronRight,
  Frame, Table2, Flower2, PartyPopper, UtensilsCrossed, Columns3, Gem,
  Layers, Camera, Upload, Settings, Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  fotos,
  heroFoto,
  stitch,
  ursos,
  corinthians,
  eleganteMarrom,
  salaoBrancaDeNeves,
  arcoNeon,
} from "@/assets/photos";
import logoAsset from "@/assets/logo.png.asset.json";
import { useSiteContent } from "@/lib/contentStore";
import { DecorationCard } from "@/components/home/DecorationCard";
import { CustomerReviewsSection } from "@/components/home/CustomerReviewsSection";
import { ClientMomentsSection } from "@/components/home/ClientMomentsSection";
import { formatWhatsappAvailabilityLink, formatWhatsappGeneralLink } from "@/lib/whatsapp";

// ====== DADOS DO NEGÓCIO (Padrões preservados conforme AGENTS.md) ======
const NOME = "MV Decorações";
const CIDADE = "Arapiraca - AL";
const INSTAGRAM = "mv_decoracao1";
const TELEFONE = "(82) 98769-3821";
const WA_DIRECT = "https://wa.me/message/CGSSC2KWYNFTG1"; // link direto da conversa
const PRECOS = [
  { nome: "Festa na Mesa", valor: "R$ 60,00", obs: "Ideal para mesas compactas e comemorações íntimas." },
  { nome: "Kit Pegue e Monte", valor: "R$ 100,00", obs: "Nosso kit mais pedido, com excelente custo-benefício.", destaque: true },
  {
    nome: "Decoração Pronta",
    valor: "R$ 300,00",
    obs: "Montagem completa de salão. Valor final depende da localidade.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `Decoração de Festas & Pegue e Monte em ${CIDADE} | ${NOME}` },
      {
        name: "description",
        content: `Decoração de festas e pegue e monte em ${CIDADE}: kits infantis, chá de bebê, times e adulto. Montagem com carinho e pontualidade. Peça seu orçamento pelo WhatsApp.`,
      },
      { property: "og:title", content: `Decoração de Festas em ${CIDADE} | ${NOME}` },
      {
        property: "og:description",
        content: "Sua festa inesquecível, sem complicação. Temas infantis, adultos, mesversário e esportes em Arapiraca.",
      },
    ],
  }),
  component: Index,
});

const nav = [
  ["inicio", "Início"], ["como-funciona", "Como Funciona"], ["temas", "Temas"],
  ["galeria", "Galeria"], ["depoimentos", "Depoimentos"], ["contato", "Contato"],
];

const temas = [
  { nome: "Infantil", img: stitch, cat: "Infantil" },
  { nome: "Chá de bebê & Mesversário", img: ursos, cat: "Bebê & Mesversário" },
  { nome: "Times & Futebol", img: corinthians, cat: "Esportes" },
  { nome: "Adulto & Elegante", img: eleganteMarrom, cat: "Adulto" },
  { nome: "Festa completa em salão", img: salaoBrancaDeNeves, cat: "Infantil" },
  { nome: "Tema personalizado", img: arcoNeon, cat: "Adulto" },
];
const galeria = fotos;
const cats = ["Todas", "Infantil", "Bebê & Mesversário", "Esportes", "Adulto"];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

function CTA({ label = "Pedir orçamento" }: { label?: string }) {
  return (
    <a href={WA_DIRECT} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:opacity-95">
      <MessageCircle className="h-4 w-4" /> {label}
    </a>
  );
}

function Title({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold">{kicker}</p>
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      <div className="mx-auto mt-5 flex items-center justify-center gap-2" aria-hidden="true">
        <span className="h-px w-10 bg-gold/60" />
        <Sparkles className="h-3.5 w-3.5 text-gold" />
        <span className="h-px w-10 bg-gold/60" />
      </div>
      {sub && <p className="mt-4 leading-relaxed text-muted-foreground">{sub}</p>}
    </Reveal>
  );
}

function Index() {
  const { content } = useSiteContent();
  const activeNome = content.business.nome;
  const activeCidade = content.business.cidade;
  const activeInstagram = content.business.instagram;
  const activeTelefone = content.business.telefone;
  const activeWa = content.business.waDirect;

  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [filtro, setFiltro] = useState("Todas");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [dep, setDep] = useState(0);
  const [mensagemCopiada, setMensagemCopiada] = useState(false);
  const [nota, setNota] = useState(0);
  const [enviandoAv, setEnviandoAv] = useState(false);
  const [avEnviada, setAvEnviada] = useState(false);
  const [enviandoMom, setEnviandoMom] = useState(false);
  const [momEnviado, setMomEnviado] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState<{ nome: string; nota: number; comentario: string }[]>([]);
  const [momentos, setMomentos] = useState<{ id: string; nome: string; legenda: string; url: string; tipo: string }[]>([]);

  const input =
    "w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  useEffect(() => {
    supabase
      .from("avaliacoes")
      .select("nome, nota, comentario")
      .eq("aprovado", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setAvaliacoes(data);
      });
    supabase
      .from("momentos")
      .select("id, nome, legenda, media_url, media_type")
      .eq("aprovado", true)
      .order("created_at", { ascending: false })
      .then(async ({ data }) => {
        if (!data) return;
        const comUrl = await Promise.all(
          data.map(async (m) => {
            const { data: signed } = await supabase.storage
              .from("momentos")
              .createSignedUrl(m.media_url, 60 * 60);
            return {
              id: m.id,
              nome: m.nome ?? "",
              legenda: m.legenda ?? "",
              url: signed?.signedUrl ?? "",
              tipo: m.media_type === "video" ? "video" : "imagem",
            };
          }),
        );
        setMomentos(comUrl.filter((m) => m.url));
      });
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtro]);

  const depoimentos = [
    { nome: "Juliana M.", texto: "Tudo chegou no horário, montado com muito capricho. A festa da minha filha ficou um sonho!", foto: fotos[25]!.img },
    { nome: "Carla e Rafael", texto: "A decoração ficou linda e delicada, exatamente como imaginamos. Atendimento impecável.", foto: fotos[16]!.img },
    { nome: "Patrícia S.", texto: "Itens lindos e limpinhos, e eu não precisei me preocupar com nada. Super recomendo!", foto: fotos[26]!.img },
  ];

  const d = depoimentos[dep]!;

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nomeCliente = form.get("nome");
    const dataFesta = form.get("data");
    const temaFesta = form.get("tema");
    const observacoes = form.get("obs");

    const textoFormatado = `Olá! Meu nome é ${nomeCliente}.\nGostaria de solicitar um orçamento para uma decoração da MV Decorações em Arapiraca:\n• Data prevista: ${dataFesta || "A definir"}\n• Tema de interesse: ${temaFesta || "A combinar"}${observacoes ? `\n• Detalhes: ${observacoes}` : ""
      }`;

    try {
      await navigator.clipboard.writeText(textoFormatado);
      setMensagemCopiada(true);
      toast.success("Mensagem copiada! Abrindo WhatsApp...");
    } catch {
      /* fallback se não tiver acesso à clipboard */
    }

    const whatsappLink = formatWhatsappGeneralLink(activeTelefone, textoFormatado);
    window.open(whatsappLink, "_blank");
  }

  const handleEnviarContato = enviar;

  async function enviarAvaliacao(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!nota) return;
    setEnviandoAv(true);
    const form = e.currentTarget;
    const f = new FormData(form);
    const { error } = await supabase.from("avaliacoes").insert({ nome: String(f.get("nome")), nota, comentario: String(f.get("comentario")) });
    setEnviandoAv(false);
    if (!error) { setAvEnviada(true); form.reset(); setNota(0); }
  }

  async function enviarMomento(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const file = f.get("arquivo") as File | null;
    if (!file || file.size === 0) return;
    setEnviandoMom(true);
    const tipo = file.type.startsWith("video") ? "video" : "image";
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const up = await supabase.storage.from("momentos").upload(path, file);
    if (!up.error) {
      const { error } = await supabase.from("momentos").insert({ nome: String(f.get("nome")), legenda: String(f.get("legenda") || ""), media_url: path, media_type: tipo });
      if (!error) { setMomEnviado(true); form.reset(); }
    }
    setEnviandoMom(false);
  }

  // Itens de navegação da página
  const navLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Temas", href: "#galeria" },
    { label: "Serviços", href: "#servicos" },
    { label: "Avaliações", href: "#avaliacoes" },
    { label: "Momentos", href: "#momentos" },
    { label: "Dúvidas", href: "#faq" },
    { label: "Contato", href: "#contato" },
  ];

  const logoSize = content.globalStyles?.logoSizePx || 40;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-gold/30 selection:text-foreground">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. CABEÇALHO COM LOGOTIPO, NAVEGAÇÃO E BOTÃO DE ORÇAMENTO   */}
      {/* ──────────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5">
          {/* Logo e Nome Comercial */}
          <a
            href="#inicio"
            className="flex min-w-0 items-center gap-3 transition hover:opacity-90"
            aria-label={`Ir para o início de ${activeNome}`}
          >
            <img
              src={logoAsset.url}
              alt={`Logotipo da ${activeNome}`}
              style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
              className="shrink-0 rounded-full object-cover shadow-sm ring-2 ring-gold/40"
            />
            <div className="min-w-0">
              <span className="truncate font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {activeNome}
              </span>
              <p className="hidden text-[10px] font-medium uppercase tracking-wider text-gold sm:block">
                Festas & Pegue e Monte • {activeCidade}
              </p>
            </div>
          </a>

          {/* Navegação Desktop */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground transition hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Botão de Orçamento no Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={activeWa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-soft transition hover:opacity-95 hover:shadow-lg active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Orçamento no WhatsApp</span>
            </a>
          </div>

          {/* Botão Hambúrguer Mobile */}
          <button
            type="button"
            aria-label={menuMobileOpen ? "Fechar menu" : "Abrir menu"}
            className="rounded-xl border border-border p-2 text-foreground lg:hidden hover:bg-secondary transition"
            onClick={() => setMenuMobileOpen(!menuMobileOpen)}
          >
            {menuMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Menu Mobile */}
        {menuMobileOpen && (
          <div className="border-t border-border bg-background px-6 py-5 shadow-2xl lg:hidden animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuMobileOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-5 pt-4 border-t border-border">
              <a
                href={activeWa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuMobileOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs font-bold text-primary-foreground shadow-soft"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Pedir Orçamento pelo WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. SEÇÃO INICIAL (HERO): MENSAGEM, FOTO E CHAMADA            */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="inicio" className="relative overflow-hidden bg-hero pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          {/* Texto de Apresentação */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-gold shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Decorações em {activeCidade}</span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Sua festa dos sonhos,{" "}
              <span className="italic text-primary font-normal">sem complicação</span>.
            </h1>

            <p className="max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground">
              Você escolhe o tema e nós cuidamos de cada detalhe com amor e bom gosto. A entrega e a retirada são combinadas diretamente com você por mensagem, para organizarmos tudo conforme as necessidades do seu evento.
            </p>

            {/* Badges de Destaque */}
            <div className="grid grid-cols-2 gap-3 pt-2 sm:max-w-md">
              <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card p-3 shadow-xs">
                <Truck className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-medium text-foreground">Entrega & Montagem</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card p-3 shadow-xs">
                <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                <span className="text-xs font-medium text-foreground">Peças Higienizadas</span>
              </div>
            </div>

            {/* Chamadas para Ação */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href={activeWa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-bold text-primary-foreground shadow-soft transition hover:opacity-95 hover:shadow-lg active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Solicitar Orçamento no WhatsApp</span>
              </a>

              <a
                href="#galeria"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-6 py-3.5 text-xs font-semibold text-foreground transition hover:border-gold hover:bg-secondary active:scale-95"
              >
                <span>Ver Decorações</span>
                <ChevronRight className="h-3.5 w-3.5 text-gold" />
              </a>
            </div>
          </div>

          {/* Fotografia Principal de Destaque */}
          <div className="relative flex justify-center">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gold/15 blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2.2rem] border border-border/80 bg-card p-2 shadow-2xl transition hover:scale-[1.01]">
              <img
                src={heroFoto}
                alt="Decoração de festa com painel e balões por MV Decorações"
                width={700}
                height={850}
                className="aspect-[4/5] w-full rounded-[1.8rem] object-cover"
              />
              <div className="absolute bottom-5 inset-x-5 rounded-2xl bg-black/60 p-3.5 backdrop-blur-md text-white shadow-lg">
                <p className="text-xs font-bold font-display">Acabamento Impecável & Balões Orgânicos</p>
                <p className="text-[11px] text-slate-200">Kits personalizados para cada comemoração</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-5 py-24">
        <Title kicker="Simples assim" title="Como funciona" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[[Palette, "Escolha o tema", "Navegue pelos nossos temas ou conte sua ideia."], [MessageCircle, "Receba o orçamento", "Respondemos rapidinho pelo WhatsApp."], [Truck, "Entregamos e montamos", "O horário da entrega é combinado com você por mensagem."], [PackageCheck, "Retiramos após a festa", "A retirada também é combinada por mensagem."]].map(([I, t, d], i) => {
            const Icon = I as typeof Palette;
            return (
              <Reveal key={i} className="rounded-3xl bg-card p-7 text-center shadow-soft">
                <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary"><Icon /></div>
                <p className="mb-1 text-xs text-gold">Passo {i + 1}</p>
                <h3 className="text-xl font-semibold">{t as string}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mx-auto mt-10 max-w-2xl rounded-2xl border border-gold/50 bg-secondary px-6 py-4 text-center text-sm text-secondary-foreground">
          <span className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4 shrink-0 text-primary" />
            <span>As datas de <strong>entrega e retirada são combinadas por mensagem</strong> — a gente ajusta tudo ao horário da sua festa.</span>
          </span>
        </Reveal>
        <div className="mt-10 text-center"><CTA /></div>
      </section>

      {/* Temas */}
      <section id="temas" className="bg-muted py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Title kicker="Para cada momento" title="Temas e decorações" sub="Kits completos e personalizáveis para deixar sua comemoração inesquecível." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {temas.map((t) => (
              <Reveal key={t.nome} className="group overflow-hidden rounded-3xl bg-card shadow-soft">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={t.img} loading="lazy" width={800} height={1008} alt={`Decoração ${t.nome}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between gap-3 p-5">
                  <h3 className="text-xl font-semibold">{t.nome}</h3>
                  <a href={WA_DIRECT} target="_blank" rel="noreferrer" className="shrink-0 rounded-full bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground">Quero este tema</a>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {PRECOS.map((p) => (
              <Reveal key={p.nome} className="rounded-3xl border border-gold/40 bg-card p-7 text-center shadow-soft">
                <h3 className="text-xl font-semibold">{p.nome}</h3>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">a partir de</p>
                <p className="font-display text-4xl font-semibold text-primary">{p.valor}</p>
                {p.obs && <p className="mt-3 text-sm text-muted-foreground">{p.obs}</p>}
              </Reveal>
            ))}
          </div>
          <Reveal className="mx-auto mt-8 max-w-2xl rounded-2xl bg-secondary px-6 py-4 text-center text-sm text-secondary-foreground">
            Alugamos também <strong>peças separadas</strong> e montamos o kit de acordo com a necessidade do cliente.
          </Reveal>
          <div className="mt-10 text-center"><CTA /></div>
        </div>
      </section>

      {/* Lightbox / Modal de Foto Ampliada */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[92vh] max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-3 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Fechar visualização ampliada"
              className="absolute right-5 top-5 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition"
            >
              <X className="h-5 w-5" />
            </button>
            <img src={lightbox} alt="Foto ampliada" className="max-h-[85vh] w-auto rounded-2xl" />
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. SEÇÃO DE SERVIÇOS & COMO FUNCIONA (SEM REDUNDÂNCIAS)      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="servicos" className="relative scroll-mt-20 bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold shadow-sm">
              <Layers className="h-3.5 w-3.5" />
              <span>Opções & Valores</span>
            </div>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Nossos Serviços de Decoração
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
              Trabalhamos com opções práticas e acessíveis para que sua festa tenha a elegância que você merece.
            </p>
          </div>
          <div className="mt-10 text-center"><CTA label="Consultar itens" /></div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Title kicker="Por que nós" title="Nossos diferenciais" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[[Clock, "Pontualidade", "Tudo pronto antes dos convidados chegarem."], [Sparkles, "Itens higienizados", "Peças limpas e bem cuidadas a cada evento."], [Hammer, "Montagem profissional", "Equipe experiente e caprichosa."], [Heart, "Atendimento personalizado", "Cada festa é única, como você."]].map(([I, t, d]) => {
            const Icon = I as typeof Clock;
            return (
              <Reveal key={t as string} className="rounded-3xl border border-border p-7">
                <Icon className="mb-4 text-primary" />
                <h3 className="text-lg font-semibold">{t as string}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="bg-hero py-24">
        <div className="mx-auto max-w-3xl px-5">
          <Title kicker="Quem já fez festa com a gente" title="Depoimentos" />
          <div className="relative rounded-3xl bg-card p-8 text-center shadow-soft sm:p-12">
            <img src={d.foto} alt={d.nome} loading="lazy" className="mx-auto h-20 w-20 rounded-full object-cover" />
            <div className="mt-4 flex justify-center gap-1 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
            <p className="mt-5 font-display text-xl italic">"{d.texto}"</p>
            <p className="mt-4 text-sm font-medium text-muted-foreground">{d.nome}</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <button aria-label="Anterior" onClick={() => setDep((dep + 2) % 3)} className="rounded-full bg-secondary p-2"><ChevronLeft className="h-4 w-4" /></button>
              {depoimentos.map((_, i) => <span key={i} className={`h-2 rounded-full transition-all ${i === dep ? "w-6 bg-primary" : "w-2 bg-border"}`} />)}
              <button aria-label="Próximo" onClick={() => setDep((dep + 1) % 3)} className="rounded-full bg-secondary p-2"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Momentos dos clientes */}
      <section id="momentos" className="bg-muted py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Title kicker="Clientes" title="Momentos dos clientes" sub="Registros de quem já fez festa com a gente — envie o seu também!" />
          {momentos.length > 0 && (
            <div className="mb-12 columns-2 gap-4 md:columns-3">
              {momentos.map((m) => (
                <figure key={m.id} className="mb-4 overflow-hidden rounded-2xl bg-card shadow-soft">
                  {m.tipo === "video"
                    ? <video src={m.url} controls className="w-full" />
                    : <img src={m.url} loading="lazy" alt={m.legenda || `Momento de ${m.nome}`} className="w-full object-cover" />}
                  <figcaption className="p-3 text-sm">
                    {m.legenda && <p className="text-muted-foreground">{m.legenda}</p>}
                    <p className="mt-1 text-xs font-medium text-gold">{m.nome}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
          <Reveal className="mx-auto max-w-xl rounded-3xl bg-card p-7 shadow-soft">
            <h3 className="flex items-center gap-2 text-xl font-semibold"><Camera className="text-primary" /> Envie seu momento</h3>
            <p className="mt-2 text-sm text-muted-foreground">Fez festa com a gente? Compartilhe uma foto ou vídeo (até 50 MB). Ele aparece aqui após aprovação.</p>
            <form onSubmit={enviarMomento} className="mt-5 space-y-4">
              <input name="nome" required placeholder="Seu nome" className={input} />
              <input name="legenda" placeholder="Legenda (opcional)" className={input} />
              <input name="arquivo" required type="file" accept="image/*,video/*" className={input} />
              <button disabled={enviandoMom} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
                <Upload className="h-4 w-4" /> {enviandoMom ? "Enviando..." : "Enviar foto ou vídeo"}
              </button>
              {momEnviado && <p className="text-center text-xs text-muted-foreground">Recebido! Seu momento aparecerá aqui após aprovação. Obrigado! 💛</p>}
            </form>
          </Reveal>
        </div>
      </section>

      {/* Avalie sua experiência */}
      <section id="avaliar" className="mx-auto max-w-6xl px-5 py-24">
        <Title kicker="Sua opinião importa" title="Avalie sua experiência" sub="Conte como foi sua festa com a gente — sua nota ajuda outros clientes." />
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal className="rounded-3xl bg-card p-7 shadow-soft">
            <form onSubmit={enviarAvaliacao} className="space-y-4">
              <div className="flex items-center justify-center gap-2" role="radiogroup" aria-label="Sua nota">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setNota(n)} aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                    className="transition hover:scale-110">
                    <Star className={`h-9 w-9 ${n <= nota ? "fill-current text-gold" : "text-border"}`} />
                  </button>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground">{nota ? `Sua nota: ${nota} de 5` : "Toque nas estrelas para dar sua nota"}</p>
              <input name="nome" required placeholder="Seu nome" className={input} />
              <textarea name="comentario" required rows={4} placeholder="Conte como foi sua experiência" className={input} />
              <button disabled={enviandoAv || !nota} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
                <Star className="h-4 w-4" /> {enviandoAv ? "Enviando..." : "Enviar avaliação"}
              </button>
              {avEnviada && <p className="text-center text-xs text-muted-foreground">Obrigado! Sua avaliação aparecerá aqui após aprovação. 💛</p>}
            </form>
          </Reveal>
          <div className="space-y-4">
            {avaliacoes.length === 0 && (
              <Reveal className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Seja o primeiro a avaliar! Sua nota aparecerá neste espaço.
              </Reveal>
            )}
            {avaliacoes.map((a, i) => (
              <Reveal key={i} className="rounded-3xl bg-card p-6 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{a.nome}</p>
                  <div className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className={`h-4 w-4 ${s < a.nota ? "fill-current" : "text-border"}`} />)}</div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">"{a.comentario}"</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. SEÇÃO DE AVALIAÇÕES REAIS DOS CLIENTES COM ATÉ 5 ESTRELAS */}
      {/* ──────────────────────────────────────────────────────────── */}
      <CustomerReviewsSection />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. SEÇÃO MOMENTOS DOS NOSSOS CLIENTES (FOTOS E VÍDEOS REAIS) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <ClientMomentsSection />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. SEÇÃO DE PERGUNTAS FREQUENTES (FAQ COM DETAILS/SUMMARY)   */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="relative scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tire Suas Dúvidas</span>
            </div>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Perguntas Frequentes
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Tudo o que você precisa saber para planejar sua festa com tranquilidade.
            </p>
          </div>

          {/* Accordion nativo com details e summary (regra estrita AGENTS.md) */}
          <div className="mt-12 space-y-3">
            {[
              {
                p: "Como faço para reservar uma decoração?",
                r: "Basta entrar em contato pelo WhatsApp informando a data, o tema de preferência e o local do evento. Confirmamos a disponibilidade e a reserva é garantida mediante um sinal.",
              },
              {
                p: "Com quanto tempo de antecedência devo solicitar?",
                r: "Recomendamos entrar em contato com pelo menos 15 a 30 dias de antecedência, principalmente para datas em fins de semana e feriados.",
              },
              {
                p: "Qual é a área de atendimento da MV Decorações?",
                r: "Atendemos toda a cidade de Arapiraca - AL e municípios vizinhos. A taxa de deslocamento é informada previamente no seu orçamento.",
              },
              {
                p: "Quais são as formas de pagamento aceitas?",
                r: "Aceitamos Pix, transferência e cartões de crédito e débito. Facilitamos as condições no momento do orçamento.",
              },
              {
                p: "Vocês alugam peças separadas?",
                r: "Sim! Além dos kits completos de pegue e monte, temos opções de locação avulsa para painéis, cilindros, mesas e peças decorativas.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition hover:border-gold/50"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-foreground">
                  <span>{faq.p}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs text-gold transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
                  {faq.r}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={activeWa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-xs font-bold text-foreground hover:bg-secondary transition"
            >
              <MessageCircle className="h-4 w-4 text-gold" />
              <span>Ainda tem dúvidas? Fale conosco no WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 8. CHAMADA FINAL PARA CONTATO PELO WHATSAPP                  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="contato" className="relative scroll-mt-20 bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          {/* Informações e Contato Direto */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold shadow-sm">
              <Calendar className="h-3.5 w-3.5" />
              <span>Vamos Conversar</span>
            </div>

            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pronto para transformar sua celebração em um momento inesquecível?
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Mande uma mensagem para nós pelo WhatsApp. Respondemos prontamente com opções personalizadas para o tema e o espaço da sua festa em Arapiraca e região.
            </p>

            <div className="space-y-3 pt-2">
              <a
                href={activeWa}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 transition hover:border-gold hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">WhatsApp Comercial</p>
                  <p className="font-semibold text-sm text-foreground">{activeTelefone}</p>
                </div>
              </a>

              {activeInstagram && (
                <a
                  href={`https://instagram.com/${activeInstagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 transition hover:border-gold hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Siga no Instagram</p>
                    <p className="font-semibold text-sm text-foreground">@{activeInstagram}</p>
                  </div>
                </a>
              )}

              <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Localização</p>
                  <p className="font-semibold text-sm text-foreground">{activeCidade}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário Rápido que agiliza a mensagem do WhatsApp */}
          <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-xl">
            <h3 className="font-display text-xl font-bold text-foreground">
              Solicitar Orçamento Rápido
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Preencha os dados e abra o WhatsApp diretamente com as informações prontas:
            </p>

            <form onSubmit={handleEnviarContato} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Seu Nome *
                </label>
                <input
                  name="nome"
                  required
                  placeholder="Ex: Carla Silva"
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Data do Evento
                  </label>
                  <input
                    name="data"
                    type="date"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tema Desejado
                  </label>
                  <input
                    name="tema"
                    placeholder="Ex: Safari, Princesas, Adulto..."
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Observações ou Detalhes (opcional)
                </label>
                <textarea
                  name="obs"
                  rows={3}
                  placeholder="Conte-nos sobre o local, quantidade aproximada de convidados ou preferências..."
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-soft transition hover:opacity-95 active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enviar Orçamento pelo WhatsApp</span>
              </button>

              {mensagemCopiada && (
                <p className="text-center text-xs text-emerald-600 dark:text-emerald-400">
                  ✓ Mensagem enviada para a área de transferência e WhatsApp aberto!
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 9. RODAPÉ ORGANIZADO COM CONTATOS E INFORMAÇÕES              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 text-sm sm:grid-cols-3 items-center">
          {/* Logo e Nome */}
          <div className="flex items-center gap-3">
            <img
              src={logoAsset.url}
              alt={`Logotipo ${activeNome}`}
              style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
              className="shrink-0 rounded-full object-cover ring-1 ring-gold/40"
            />
            <div>
              <span className="font-display text-base font-bold text-foreground">{activeNome}</span>
              <p className="text-[11px] text-muted-foreground">{activeCidade}</p>
            </div>
          </div>

          {/* Horário de Atendimento */}
          <div className="text-center sm:text-left">
            <p className="font-semibold text-xs text-foreground">Atendimento & Informações</p>
            <p className="mt-1 text-xs text-muted-foreground">Segunda a Sábado: 8h às 18h</p>
          </div>

          {/* Links e Atalho Admin */}
          <div className="flex items-center justify-center sm:justify-end gap-3">
            {activeInstagram && (
              <a
                href={`https://instagram.com/${activeInstagram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da MV Decorações"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:text-primary transition"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}

            <a
              href={activeWa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da MV Decorações"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:text-primary transition"
            >
              <MessageCircle className="h-4 w-4" />
            </a>

            {/* Acesso ao Painel Admin */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-gold hover:text-foreground transition"
              title="Acesso restrito ao Painel Administrativo"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {activeNome}. Todos os direitos reservados. Arapiraca, Alagoas.
        </div>
      </footer>

      {/* WhatsApp Flutuante com Toque Direto */}
      <a
        href={activeWa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp com a MV Decorações"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl transition hover:scale-110 active:scale-95"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
