import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useEffect, useState, type FormEvent } from "react";
import {
  Palette,
  MessageCircle,
  Truck,
  PackageCheck,
  Clock,
  Sparkles,
  Hammer,
  Heart,
  Star,
  Instagram,
  Phone,
  MapPin,
  Menu,
  X,
  ExternalLink,
  Settings,
  ChevronRight,
  ShieldCheck,
  Check,
  Calendar,
  Layers,
  Camera,
  ZoomIn,
} from "lucide-react";
import { isAdminAuthenticatedSync } from "@/lib/adminAuth";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  fotos,
  heroFoto,
  stitch,
  ursos,
  corinthians,
  eleganteMarrom,
  salaoBrancaDeNeves,
  arcoNeon,
  resolveAssetUrl,
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

function Index() {
  const { content } = useSiteContent();

  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [lightbox, setLightbox] = useState<{ img: string; nome: string } | null>(null);
  const [mensagemCopiada, setMensagemCopiada] = useState(false);

  // Valores reativos com fallback para as constantes declaradas no topo
  const activeNome = content.business?.nome || NOME;
  const activeCidade = content.business?.cidade || CIDADE;
  const activeInstagram = content.business?.instagram ?? INSTAGRAM;
  const activeTelefone = content.business?.telefone || TELEFONE;
  const activeWa = content.business?.waDirect || WA_DIRECT;

  // Galeria de fotos reais
  const galeriaFotos = content.gallery?.fotos || fotos;
  const galeriaCategorias = ["Todas", "Infantil", "Bebê & Mesversário", "Esportes", "Adulto"];

  const fotosFiltradas =
    categoriaAtiva === "Todas"
      ? galeriaFotos
      : galeriaFotos.filter((g) => g.cat === categoriaAtiva);

  // Manipulador do formulário de contato rápido
  async function handleEnviarContato(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nomeCliente = form.get("nome");
    const dataFesta = form.get("data");
    const temaFesta = form.get("tema");
    const observacoes = form.get("obs");

    const textoFormatado = `Olá! Meu nome é ${nomeCliente}.\nGostaria de solicitar um orçamento para uma decoração da MV Decorações em Arapiraca:\n• Data prevista: ${dataFesta || "A definir"}\n• Tema de interesse: ${temaFesta || "A combinar"}${
      observacoes ? `\n• Detalhes: ${observacoes}` : ""
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
              src={resolveAssetUrl(logoAsset.url)}
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

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. GALERIA PROFISSIONAL DE DECORAÇÕES COM FILTROS E WHATSAPP */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="galeria" className="relative scroll-mt-20 bg-gallery py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          {/* Título e Apresentação da Galeria */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Portfólio de Trabalhos</span>
            </div>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Galeria de Decorações
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
              Explore fotos reais de decorações montadas pela MV Decorações. Toque na imagem para ampliar ou consulte a disponibilidade da sua data pelo WhatsApp.
            </p>
          </div>

          {/* Filtros de Categoria */}
          <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Categorias de decoração">
            {galeriaCategorias.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={categoriaAtiva === cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-all active:scale-95 ${
                  categoriaAtiva === cat
                    ? "bg-primary text-primary-foreground shadow-soft ring-2 ring-primary/20"
                    : "border border-border bg-card text-foreground hover:border-gold hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Contador Discreto */}
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Exibindo <strong>{fotosFiltradas.length}</strong> {fotosFiltradas.length === 1 ? "decoração" : "decorações"} na categoria <strong>{categoriaAtiva}</strong>
          </p>

          {/* Grade de Decorações */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fotosFiltradas.map((item, idx) => (
              <DecorationCard
                key={item.id || item.n || idx}
                id={String(item.n || idx)}
                nome={item.nome || `Decoração ${item.cat} #${item.n}`}
                img={item.img}
                cat={item.cat}
                aspect="portrait"
                telefone={activeTelefone}
                onZoom={(img, nome) => setLightbox({ img, nome })}
              />
            ))}
          </div>

          {/* Botão de Orçamento Geral abaixo da galeria */}
          <div className="mt-14 text-center">
            <a
              href={activeWa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold/60 bg-card px-8 py-3.5 text-xs font-bold text-foreground shadow-sm transition hover:bg-gold/10 hover:border-gold active:scale-95"
            >
              <MessageCircle className="h-4 w-4 text-gold" />
              <span>Não encontrou seu tema? Fale conosco no WhatsApp</span>
            </a>
          </div>
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

            <img
              src={lightbox.img}
              alt={lightbox.nome}
              className="max-h-[75vh] w-full rounded-2xl object-contain"
            />

            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-2">
              <div>
                <h3 className="font-display font-bold text-base text-white">{lightbox.nome}</h3>
                <p className="text-xs text-slate-300">MV Decorações • Arapiraca - AL</p>
              </div>

              <a
                href={formatWhatsappAvailabilityLink(lightbox.nome, activeTelefone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow transition hover:bg-emerald-500 active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Consultar esta decoração no WhatsApp</span>
              </a>
            </div>
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

          {/* Cards de Planos e Preços */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PRECOS.map((plano) => (
              <div
                key={plano.nome}
                className={`relative flex flex-col justify-between rounded-3xl border bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 ${
                  plano.destaque
                    ? "border-primary ring-2 ring-primary/20 shadow-lg"
                    : "border-border/80"
                }`}
              >
                {plano.destaque && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                    Mais Procurado
                  </span>
                )}

                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">{plano.nome}</h3>
                  <p className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">A partir de</p>
                  <p className="mt-2 font-display text-4xl font-extrabold text-primary">{plano.valor}</p>
                  {plano.obs && (
                    <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                      {plano.obs}
                    </p>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-border/60">
                  <a
                    href={formatWhatsappGeneralLink(
                      activeTelefone,
                      `Olá! Gostaria de mais detalhes sobre o serviço ${plano.nome} da MV Decorações.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-bold transition active:scale-95 ${
                      plano.destaque
                        ? "bg-primary text-primary-foreground shadow hover:opacity-95"
                        : "border border-border bg-secondary text-foreground hover:bg-gold/10 hover:border-gold"
                    }`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Solicitar Disponibilidade</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Passo a passo prático */}
          <div className="mt-16 rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-soft">
            <h3 className="font-display text-xl font-bold text-center text-foreground sm:text-2xl mb-8">
              Como funciona o atendimento
            </h3>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-display font-bold text-lg mb-3">
                  1
                </div>
                <h4 className="font-semibold text-sm text-foreground">Escolha o Tema</h4>
                <p className="mt-1 text-xs text-muted-foreground">Navegue na galeria ou traga sua referência personalizada.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-display font-bold text-lg mb-3">
                  2
                </div>
                <h4 className="font-semibold text-sm text-foreground">Consulte a Data</h4>
                <p className="mt-1 text-xs text-muted-foreground">Respondemos rapidamente pelo WhatsApp com valores e agenda.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-display font-bold text-lg mb-3">
                  3
                </div>
                <h4 className="font-semibold text-sm text-foreground">Entrega & Montagem</h4>
                <p className="mt-1 text-xs text-muted-foreground">Tudo montado com capricho antes dos convidados chegarem.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-display font-bold text-lg mb-3">
                  4
                </div>
                <h4 className="font-semibold text-sm text-foreground">Retirada Pontual</h4>
                <p className="mt-1 text-xs text-muted-foreground">Retiramos após a comemoração sem trabalho para você.</p>
              </div>
            </div>
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
              src={resolveAssetUrl(logoAsset.url)}
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
