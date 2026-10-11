import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Palette, MessageCircle, Truck, PackageCheck, Clock, Sparkles, Hammer, Heart,
  Star, Instagram, Phone, MapPin, Menu, X, ChevronLeft, ChevronRight,
  Frame, Table2, Flower2, PartyPopper, UtensilsCrossed, Columns3, Gem,
  Camera, Upload,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  fotos, heroFoto, stitch, ursos, corinthians, eleganteMarrom, salaoBrancaDeNeves, arcoNeon,
} from "@/assets/photos";
import logoAsset from "@/assets/logo.png.asset.json";

// ====== DADOS DO NEGÓCIO ======
const NOME = "MV Decorações";
const CIDADE = "Arapiraca - AL";
const INSTAGRAM = "mv_decoracao1";
const TELEFONE = "(82) 98769-3821";
const WA_DIRECT = "https://wa.me/message/CGSSC2KWYNFTG1"; // link direto da conversa
const PRECOS = [
  { nome: "Festa na Mesa", valor: "R$ 60,00", obs: "" },
  { nome: "Kit Pegue e Monte", valor: "R$ 100,00", obs: "" },
  { nome: "Decoração Pronta", valor: "R$ 300,00", obs: "Valor final depende da localidade (frete)." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `Decoração Pegue e Monte em ${CIDADE} | ${NOME}` },
      { name: "description", content: `Decoração pegue e monte em ${CIDADE}: entregamos, montamos e retiramos tudo. Temas infantis, chá de bebê, times e adulto. Peça seu orçamento pelo WhatsApp.` },
      { property: "og:title", content: `Decoração Pegue e Monte em ${CIDADE} | ${NOME}` },
      { property: "og:description", content: "Sua festa dos sonhos, sem complicação. Entregamos, montamos e retiramos tudo." },
    ],
  }),
  component: Index,
});

const nav = [
  ["inicio", "Início"], ["como-funciona", "Como Funciona"], ["temas", "Temas"],
  ["galeria", "Galeria"], ["depoimentos", "Depoimentos"], ["momentos", "Momentos"], ["avaliar", "Avaliar"], ["contato", "Contato"],
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
      className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium tracking-wide text-primary-foreground shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
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
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState("Todas");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [dep, setDep] = useState(0);
  const [copiado, setCopiado] = useState(false);
  const [nota, setNota] = useState(0);
  const [enviandoAv, setEnviandoAv] = useState(false);
  const [avEnviada, setAvEnviada] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState<{ nome: string; nota: number; comentario: string }[]>([]);
  const [momentos, setMomentos] = useState<{ id: string; nome: string; legenda: string | null; url: string; tipo: string }[]>([]);
  const [enviandoMom, setEnviandoMom] = useState(false);
  const [momEnviado, setMomEnviado] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtro]);

  useEffect(() => {
    (async () => {
      const { data: avs } = await supabase.from("avaliacoes").select("nome,nota,comentario").eq("aprovado", true).order("created_at", { ascending: false }).limit(12);
      if (avs) setAvaliacoes(avs);
      const { data: moms } = await supabase.from("momentos").select("id,nome,legenda,media_url,media_type").eq("aprovado", true).order("created_at", { ascending: false }).limit(24);
      if (moms) {
        const comUrl = await Promise.all(moms.map(async (m) => {
          const { data } = await supabase.storage.from("momentos").createSignedUrl(m.media_url, 60 * 60 * 24 * 7);
          return { id: m.id, nome: m.nome, legenda: m.legenda, url: data?.signedUrl ?? "", tipo: m.media_type };
        }));
        setMomentos(comUrl.filter((m) => m.url));
      }
    })();
  }, []);

  const depoimentos = [
    { nome: "Juliana M.", texto: "Tudo chegou no horário, montado com muito capricho. A festa da minha filha ficou um sonho!", foto: fotos[25]!.img },
    { nome: "Carla e Rafael", texto: "A decoração ficou linda e delicada, exatamente como imaginamos. Atendimento impecável.", foto: fotos[16]!.img },
    { nome: "Patrícia S.", texto: "Itens lindos e limpinhos, e eu não precisei me preocupar com nada. Super recomendo!", foto: fotos[26]!.img },
  ];

  const d = depoimentos[dep]!;

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = `Olá! Meu nome é ${f.get("nome")}.\nTelefone: ${f.get("tel")}\nData do evento: ${f.get("data")}\nTipo de festa: ${f.get("tipo")}\nMensagem: ${f.get("msg")}`;
    try { await navigator.clipboard.writeText(msg); setCopiado(true); } catch { /* sem acesso à área de transferência */ }
    window.open(WA_DIRECT, "_blank");
  }

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

  const input = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const lista = filtro === "Todas" ? galeria : galeria.filter((g) => g.cat === filtro);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" className="flex min-w-0 items-center gap-2">
            <img src={logoAsset.url} alt="Logo MV Decorações" className="h-10 w-10 shrink-0 rounded-full object-cover" />
            <span className="truncate font-display text-lg font-semibold">{NOME}</span>
          </a>
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map(([id, l]) => <a key={id} href={`#${id}`} className="text-sm text-muted-foreground transition hover:text-primary">{l}</a>)}
          </nav>
          <div className="hidden lg:block"><CTA /></div>
          <button aria-label="Menu" className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && (
          <div className="border-t border-border bg-background px-5 py-4 lg:hidden">
            {nav.map(([id, l]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block py-2 text-sm">{l}</a>)}
            <div className="mt-3"><CTA /></div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="inicio" className="bg-hero pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-gold">Decoração pegue e monte · {CIDADE}</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Sua festa dos sonhos, <em className="text-primary">sem complicação</em></h1>
            <p className="mt-6 max-w-md text-muted-foreground">Você escolhe o tema e a gente cuida do resto: entregamos, montamos com carinho e retiramos tudo depois da festa.</p>
            <p className="mt-4 inline-flex max-w-md items-start gap-2 rounded-2xl border border-gold/50 bg-secondary px-4 py-3 text-sm text-secondary-foreground">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span><strong>Entrega e retirada combinadas por mensagem.</strong> A gente se encaixa no horário da sua festa.</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTA label="Pedir orçamento pelo WhatsApp" />
              <a href="#galeria" className="inline-flex items-center rounded-full border border-gold px-6 py-3 text-sm font-medium transition hover:bg-secondary">Ver galeria</a>
            </div>
          </Reveal>
          <Reveal className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gold-gradient opacity-30 blur-2xl" />
            <img src={heroFoto} alt="Decoração de festa com painel e arco de balões" className="relative rounded-[2rem] shadow-soft" />
          </Reveal>
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
                <div className="p-5">
                  <h3 className="text-xl font-semibold">{t.nome}</h3>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {PRECOS.map((p) => (
              <Reveal key={p.nome} className="relative overflow-hidden rounded-3xl border border-gold/40 bg-card p-7 pt-9 text-center shadow-soft">
                <span className="absolute inset-x-0 top-0 h-1 bg-gold-gradient" aria-hidden="true" />
                <h3 className="text-xl font-semibold">{p.nome}</h3>
                <p className="mt-4 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">a partir de</p>
                <p className="mt-1 font-display text-4xl font-semibold text-primary">{p.valor}</p>
                {p.obs && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.obs}</p>}
              </Reveal>
            ))}
          </div>
          <Reveal className="mx-auto mt-8 max-w-2xl rounded-2xl bg-secondary px-6 py-4 text-center text-sm text-secondary-foreground">
            Alugamos também <strong>peças separadas</strong> e montamos o kit de acordo com a necessidade do cliente.
          </Reveal>
        </div>
      </section>

      {/* Galeria */}
      <section id="galeria" className="mx-auto max-w-6xl px-5 py-24">
        <Title kicker="Portfólio" title="Festas realizadas" />
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setFiltro(c)} className={`rounded-full px-4 py-2 text-sm transition ${filtro === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-blush"}`}>{c}</button>
          ))}
        </div>
        <div className="columns-2 gap-4 md:columns-3">
          {lista.map((g, i) => (
            <button key={filtro + i} onClick={() => setLightbox(g.img)} className="mb-4 block w-full overflow-hidden rounded-2xl">
              <img src={g.img} loading="lazy" alt={`Festa ${g.cat}`} className={`w-full object-cover transition duration-500 hover:scale-105 ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"}`} />
            </button>
          ))}
        </div>
      </section>
      {lightbox && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/80 p-4" onClick={() => setLightbox(null)}>
          <button aria-label="Fechar" className="absolute right-5 top-5 text-background"><X /></button>
          <img src={lightbox} alt="Foto ampliada" className="max-h-[88vh] rounded-2xl" />
        </div>
      )}

      {/* Itens */}
      <section className="bg-muted py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Title kicker="Aluguel" title="Itens disponíveis" sub="Monte a sua decoração do seu jeito com nossas peças avulsas." />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {[[Frame, "Painéis"], [Table2, "Mesas"], [Flower2, "Arranjos de flores"], [PartyPopper, "Balões"], [UtensilsCrossed, "Bandejas"], [Columns3, "Cavaletes"], [Gem, "Peças de decoração"]].map(([I, l]) => {
              const Icon = I as typeof Frame;
              return (
                <Reveal key={l as string} className="rounded-2xl bg-card p-5 text-center shadow-soft">
                  <Icon className="mx-auto mb-3 text-gold" />
                  <p className="text-sm font-medium">{l as string}</p>
                </Reveal>
              );
            })}
          </div>
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

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-24">
        <Title kicker="Dúvidas" title="Perguntas frequentes" />
        <div className="divide-y divide-border rounded-3xl bg-card px-6 shadow-soft">
          {[
            ["Como faço para reservar?", "É só nos chamar no WhatsApp com a data e o tema. Após o orçamento aprovado, a reserva é confirmada com um sinal."],
            ["Com quanto tempo de antecedência devo reservar?", "Recomendamos de 15 a 30 dias de antecedência, principalmente para fins de semana."],
            ["Qual a área de atendimento?", `Atendemos ${CIDADE} e região. Consulte para outras localidades.`],
            ["Quais as formas de pagamento?", "Pix, cartão de crédito e débito. O restante pode ser pago até a data do evento."],
            ["Qual a política de cancelamento?", "Cancelamentos com antecedência permitem remarcar a data. Consulte as condições no orçamento."],
            ["Existe taxa de entrega?", "A taxa varia conforme a distância e é informada já no orçamento. A data e o horário de entrega e retirada são combinados por mensagem."],
          ].map(([q, a], i) => (
            <details key={i} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">{q}<span className="text-gold transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="bg-muted py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2">
          <Reveal>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">Vamos conversar</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Peça seu orçamento</h2>
            <p className="mt-4 text-muted-foreground">Preencha os dados: sua mensagem é copiada e o WhatsApp abre pronto para você colar.</p>
            <ul className="mt-8 space-y-4 text-sm">
              {INSTAGRAM && <li><a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer" className="flex items-center gap-3"><Instagram className="text-primary" /> @{INSTAGRAM}</a></li>}
              <li className="flex items-center gap-3"><Phone className="text-primary" /> {TELEFONE}</li>
              <li className="flex items-center gap-3"><MapPin className="text-primary" /> Atendemos {CIDADE} e região</li>
            </ul>
          </Reveal>
          <form onSubmit={enviar} className="space-y-4 rounded-3xl bg-card p-7 shadow-soft">
            <input name="nome" required placeholder="Seu nome" className={input} />
            <input name="tel" required type="tel" placeholder="Telefone" className={input} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="data" required type="date" className={input} />
              <select name="tipo" required className={input} defaultValue="">
                <option value="" disabled>Tipo de festa</option>
                {temas.map((t) => <option key={t.nome}>{t.nome}</option>)}
                <option>Outro</option>
              </select>
            </div>
            <textarea name="msg" rows={4} placeholder="Conte um pouco sobre sua festa" className={input} />
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"><MessageCircle className="h-4 w-4" /> Enviar pelo WhatsApp</button>
            {copiado && <p className="text-center text-xs text-muted-foreground">Prontinho! Sua mensagem foi copiada — é só colar (Ctrl+V) na conversa que abriu.</p>}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 text-sm sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Logo MV Decorações" className="h-16 w-16 rounded-full object-cover" />
            <span className="font-display text-lg font-semibold">{NOME}</span>
          </div>
          <div>
            <p className="font-medium">Horário de atendimento</p>
            <p className="text-muted-foreground">Seg a Sex: 9h às 18h · Sáb: 9h às 13h</p>
          </div>
          <div className="flex gap-4 sm:justify-end">
            {INSTAGRAM && <a href={`https://instagram.com/${INSTAGRAM}`} aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram className="text-primary" /></a>}
            <a href={WA_DIRECT} aria-label="WhatsApp" target="_blank" rel="noreferrer"><MessageCircle className="text-primary" /></a>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {NOME}. Todos os direitos reservados.</p>
      </footer>

      {/* WhatsApp flutuante */}
      <a href={WA_DIRECT} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition hover:scale-110">
        <MessageCircle />
      </a>
    </div>
  );
}
