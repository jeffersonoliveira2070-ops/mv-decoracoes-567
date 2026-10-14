import { useEffect, useState } from "react";
import {
  fotos as defaultFotos,
  heroFoto as defaultHeroFoto,
  stitch,
  ursos,
  corinthians,
  eleganteMarrom,
  salaoBrancaDeNeves,
  arcoNeon,
} from "@/assets/photos";
import logoAsset from "@/assets/logo.png.asset.json";

// ====== TIPOS DO CONTEÚDO DO SITE ======

export interface NavItem {
  id: string;
  label: string;
  href: string; // Ex: "#inicio" ou "https://..."
  isVisible: boolean;
  order: number;
}

export interface HeroConfig {
  kicker: string;
  title: string;
  highlightText: string;
  description: string;
  shippingNote: string;
  primaryBtnText: string;
  primaryBtnUrl: string;
  showPrimaryBtn: boolean;
  secondaryBtnText: string;
  secondaryBtnUrl: string;
  showSecondaryBtn: boolean;
  imageUrl: string;
  imageAlt: string;
  // Tamanhos
  kickerSize: "xs" | "sm" | "base";
  titleSize: "sm" | "md" | "lg" | "xl" | "2xl";
  descSize: "sm" | "base" | "lg";
  imageScale: "sm" | "md" | "lg" | "full";
  imageRadius: "sm" | "md" | "lg" | "2xl" | "3xl" | "full";
}

export interface StepItem {
  id: string;
  stepNum: number;
  title: string;
  desc: string;
  iconName: string; // "Palette", "MessageCircle", "Truck", "PackageCheck", etc.
}

export interface HowItWorksConfig {
  kicker: string;
  title: string;
  sub: string;
  steps: StepItem[];
  bannerNote: string;
  btnText: string;
  btnUrl: string;
  showBtn: boolean;
}

export interface ThemeItem {
  id: string;
  nome: string;
  img: string;
  cat: string;
  btnText: string;
  imageHeight: "short" | "normal" | "tall";
}

export interface PriceItem {
  id: string;
  nome: string;
  valor: string;
  obs: string;
  destaque?: boolean;
}

export interface ThemesSectionConfig {
  kicker: string;
  title: string;
  sub: string;
  temas: ThemeItem[];
  precos: PriceItem[];
  bannerText: string;
  btnText: string;
  btnUrl: string;
  showBtn: boolean;
}

export interface GalleryPhotoItem {
  id: string;
  n: number;
  img: string;
  cat: string;
  aspect: "square" | "portrait" | "tall";
  nome?: string;
}

export interface GalleryConfig {
  kicker: string;
  title: string;
  categories: string[];
  fotos: GalleryPhotoItem[];
  btnText: string;
  btnUrl: string;
  showBtn: boolean;
}

export interface RentalItem {
  id: string;
  label: string;
  iconName: string;
}

export interface RentalSectionConfig {
  kicker: string;
  title: string;
  sub: string;
  items: RentalItem[];
  btnText: string;
  btnUrl: string;
  showBtn: boolean;
}

export interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  iconName: string;
}

export interface FeaturesSectionConfig {
  kicker: string;
  title: string;
  items: FeatureItem[];
}

export interface TestimonialItem {
  id: string;
  nome: string;
  texto: string;
  foto: string;
  stars: number;
}

export interface TestimonialsConfig {
  kicker: string;
  title: string;
  items: TestimonialItem[];
}

export interface FaqItem {
  id: string;
  pergunta: string;
  resposta: string;
}

export interface FaqConfig {
  kicker: string;
  title: string;
  items: FaqItem[];
  btnText: string;
  btnUrl: string;
  showBtn: boolean;
}

export interface ContactConfig {
  kicker: string;
  title: string;
  description: string;
  showInstagram: boolean;
  showPhone: boolean;
  showAddress: boolean;
  formButtonText: string;
  successMessage: string;
}

export interface FooterConfig {
  hoursTitle: string;
  hoursText: string;
  copyrightText: string;
  showInstagram: boolean;
  showWhatsapp: boolean;
}

export interface FloatingWhatsappConfig {
  isVisible: boolean;
  size: "sm" | "md" | "lg";
  position: "bottom-right" | "bottom-left";
  directLink: string;
  tooltipText: string;
}

export interface CustomInteractiveButton {
  id: string;
  label: string;
  url: string;
  style: "primary" | "secondary" | "outline" | "gold";
  size: "sm" | "md" | "lg";
  iconName?: string;
  openNewTab: boolean;
}

export interface CustomSectionItem {
  id: string;
  navLabel: string;
  anchorId: string;
  kicker: string;
  title: string;
  content: string;
  imageUrl?: string;
  imagePosition?: "left" | "right" | "top";
  imageSize?: "sm" | "md" | "lg";
  titleSize?: "sm" | "md" | "lg" | "xl";
  textSize?: "sm" | "base" | "lg";
  isVisible: boolean;
  order: number;
  buttons: CustomInteractiveButton[];
}

export interface GlobalStylesConfig {
  siteTitleScale: "normal" | "compact" | "large";
  logoSizePx: number; // Ex: 40px
  borderRadius: "rounded-lg" | "rounded-2xl" | "rounded-3xl" | "rounded-full";
  fontFamily: "poppins" | "inter" | "playfair";
  adminButtonFloating: boolean; // se exibe o atalho de admin no site
}

export interface BusinessConfig {
  nome: string;
  cidade: string;
  instagram: string;
  telefone: string;
  waDirect: string;
}

export interface SiteContent {
  business: BusinessConfig;
  navItems: NavItem[];
  hero: HeroConfig;
  howItWorks: HowItWorksConfig;
  themesSection: ThemesSectionConfig;
  gallery: GalleryConfig;
  rentalSection: RentalSectionConfig;
  features: FeaturesSectionConfig;
  testimonials: TestimonialsConfig;
  faq: FaqConfig;
  contact: ContactConfig;
  footer: FooterConfig;
  floatingWhatsapp: FloatingWhatsappConfig;
  customSections: CustomSectionItem[];
  globalStyles: GlobalStylesConfig;
}

// ====== CONTEÚDO PADRÃO ORIGINAL ======

export const DEFAULT_SITE_CONTENT: SiteContent = {
  business: {
    nome: "MV Decorações",
    cidade: "Arapiraca - AL",
    instagram: "mv_decoracao1",
    telefone: "(82) 98769-3821",
    waDirect: "https://wa.me/message/CGSSC2KWYNFTG1",
  },
  navItems: [
    { id: "inicio", label: "Início", href: "#inicio", isVisible: true, order: 1 },
    { id: "como-funciona", label: "Como Funciona", href: "#como-funciona", isVisible: true, order: 2 },
    { id: "temas", label: "Temas", href: "#temas", isVisible: true, order: 3 },
    { id: "galeria", label: "Galeria", href: "#galeria", isVisible: true, order: 4 },
    { id: "itens", label: "Itens", href: "#itens", isVisible: true, order: 5 },
    { id: "diferenciais", label: "Diferenciais", href: "#diferenciais", isVisible: true, order: 6 },
    { id: "depoimentos", label: "Depoimentos", href: "#depoimentos", isVisible: true, order: 7 },
    { id: "faq", label: "Dúvidas", href: "#faq", isVisible: true, order: 8 },
    { id: "contato", label: "Contato", href: "#contato", isVisible: true, order: 9 },
  ],
  hero: {
    kicker: "Decoração pegue e monte · Arapiraca - AL",
    title: "Sua festa dos sonhos,",
    highlightText: "sem complicação",
    description:
      "Você escolhe o tema e nós cuidamos de cada detalhe com amor e bom gosto. A entrega e a retirada são combinadas diretamente com você por mensagem, para organizarmos tudo conforme as necessidades do seu evento.",
    shippingNote: "Entrega e retirada combinadas por mensagem. A gente se encaixa no horário da sua festa.",
    primaryBtnText: "Pedir orçamento pelo WhatsApp",
    primaryBtnUrl: "https://wa.me/message/CGSSC2KWYNFTG1",
    showPrimaryBtn: true,
    secondaryBtnText: "Ver galeria",
    secondaryBtnUrl: "#galeria",
    showSecondaryBtn: true,
    imageUrl: defaultHeroFoto,
    imageAlt: "Decoração de festa com painel e arco de balões",
    kickerSize: "xs",
    titleSize: "xl",
    descSize: "base",
    imageScale: "md",
    imageRadius: "3xl",
  },
  howItWorks: {
    kicker: "Simples assim",
    title: "Como funciona",
    sub: "Quatro passos práticos para você aproveitar a festa sem dor de cabeça.",
    steps: [
      {
        id: "step-1",
        stepNum: 1,
        title: "Escolha o tema",
        desc: "Navegue pelos nossos temas ou conte sua ideia.",
        iconName: "Palette",
      },
      {
        id: "step-2",
        stepNum: 2,
        title: "Receba o orçamento",
        desc: "Respondemos rapidinho pelo WhatsApp com os valores e disponibilidade.",
        iconName: "MessageCircle",
      },
      {
        id: "step-3",
        stepNum: 3,
        title: "Entregamos e montamos",
        desc: "O horário da entrega é combinado com você por mensagem.",
        iconName: "Truck",
      },
      {
        id: "step-4",
        stepNum: 4,
        title: "Retiramos após a festa",
        desc: "A retirada também é combinada por mensagem, sem você precisar desmontar nada.",
        iconName: "PackageCheck",
      },
    ],
    bannerNote:
      "As datas de entrega e retirada são combinadas por mensagem — a gente ajusta tudo ao horário da sua festa.",
    btnText: "Pedir orçamento",
    btnUrl: "https://wa.me/message/CGSSC2KWYNFTG1",
    showBtn: true,
  },
  themesSection: {
    kicker: "Para cada momento",
    title: "Temas e decorações",
    sub: "Kits completos e personalizáveis para deixar sua comemoração inesquecível.",
    temas: [
      { id: "tema-1", nome: "Infantil", img: stitch, cat: "Infantil", btnText: "Quero este tema", imageHeight: "normal" },
      { id: "tema-2", nome: "Chá de bebê & Mesversário", img: ursos, cat: "Bebê & Mesversário", btnText: "Quero este tema", imageHeight: "normal" },
      { id: "tema-3", nome: "Times & Futebol", img: corinthians, cat: "Esportes", btnText: "Quero este tema", imageHeight: "normal" },
      { id: "tema-4", nome: "Adulto & Elegante", img: eleganteMarrom, cat: "Adulto", btnText: "Quero este tema", imageHeight: "normal" },
      { id: "tema-5", nome: "Festa completa em salão", img: salaoBrancaDeNeves, cat: "Infantil", btnText: "Quero este tema", imageHeight: "normal" },
      { id: "tema-6", nome: "Tema personalizado", img: arcoNeon, cat: "Adulto", btnText: "Quero este tema", imageHeight: "normal" },
    ],
    precos: [
      { id: "preco-1", nome: "Festa na Mesa", valor: "R$ 60,00", obs: "Ideal para mesas compactas e comemorações íntimas." },
      { id: "preco-2", nome: "Kit Pegue e Monte", valor: "R$ 100,00", obs: "Nosso kit mais pedido, com excelente custo-benefício.", destaque: true },
      { id: "preco-3", nome: "Decoração Pronta", valor: "R$ 300,00", obs: "Valor final depende da localidade (frete)." },
    ],
    bannerText: "Alugamos também peças separadas e montamos o kit de acordo com a necessidade do cliente.",
    btnText: "Pedir orçamento",
    btnUrl: "https://wa.me/message/CGSSC2KWYNFTG1",
    showBtn: true,
  },
  gallery: {
    kicker: "Portfólio",
    title: "Festas realizadas",
    categories: ["Todas", "Infantil", "Bebê & Mesversário", "Esportes", "Adulto"],
    fotos: defaultFotos.map((f, i) => ({
      id: `foto-${f.n}`,
      n: f.n,
      img: f.img,
      cat: f.cat,
      aspect: i % 3 === 0 ? "portrait" : i % 3 === 1 ? "square" : "tall",
      nome: (f as any).nome || `Decoração ${f.cat} #${f.n}`,
    })),
    btnText: "Pedir orçamento",
    btnUrl: "https://wa.me/message/CGSSC2KWYNFTG1",
    showBtn: true,
  },
  rentalSection: {
    kicker: "Aluguel",
    title: "Itens disponíveis",
    sub: "Monte a sua decoração do seu jeito com nossas peças avulsas.",
    items: [
      { id: "item-1", label: "Painéis", iconName: "Frame" },
      { id: "item-2", label: "Mesas", iconName: "Table2" },
      { id: "item-3", label: "Arranjos de flores", iconName: "Flower2" },
      { id: "item-4", label: "Balões", iconName: "PartyPopper" },
      { id: "item-5", label: "Bandejas", iconName: "UtensilsCrossed" },
      { id: "item-6", label: "Cavaletes", iconName: "Columns3" },
      { id: "item-7", label: "Peças de decoração", iconName: "Gem" },
    ],
    btnText: "Consultar itens",
    btnUrl: "https://wa.me/message/CGSSC2KWYNFTG1",
    showBtn: true,
  },
  features: {
    kicker: "Por que nós",
    title: "Nossos diferenciais",
    items: [
      { id: "feat-1", title: "Pontualidade", desc: "Tudo pronto antes dos convidados chegarem.", iconName: "Clock" },
      { id: "feat-2", title: "Itens higienizados", desc: "Peças limpas e bem cuidadas a cada evento.", iconName: "Sparkles" },
      { id: "feat-3", title: "Montagem profissional", desc: "Equipe experiente e caprichosa em cada detalhe.", iconName: "Hammer" },
      { id: "feat-4", title: "Atendimento personalizado", desc: "Cada festa é única, como você.", iconName: "Heart" },
    ],
  },
  testimonials: {
    kicker: "Quem já fez festa com a gente",
    title: "Depoimentos",
    items: [
      {
        id: "dep-1",
        nome: "Juliana M.",
        texto: "Tudo chegou no horário, montado com muito capricho. A festa da minha filha ficou um sonho!",
        foto: defaultFotos[25]?.img ?? "",
        stars: 5,
      },
      {
        id: "dep-2",
        nome: "Carla e Rafael",
        texto: "A decoração ficou linda e delicada, exatamente como imaginamos. Atendimento impecável.",
        foto: defaultFotos[16]?.img ?? "",
        stars: 5,
      },
      {
        id: "dep-3",
        nome: "Patrícia S.",
        texto: "Itens lindos e limpinhos, e eu não precisei me preocupar com nada. Super recomendo!",
        foto: defaultFotos[26]?.img ?? "",
        stars: 5,
      },
    ],
  },
  faq: {
    kicker: "Dúvidas",
    title: "Perguntas frequentes",
    items: [
      {
        id: "faq-1",
        pergunta: "Como faço para reservar?",
        resposta: "É só nos chamar no WhatsApp com a data e o tema. Após o orçamento aprovado, a reserva é confirmada com um sinal.",
      },
      {
        id: "faq-2",
        pergunta: "Com quanto tempo de antecedência devo reservar?",
        resposta: "Recomendamos de 15 a 30 dias de antecedência, principalmente para fins de semana.",
      },
      {
        id: "faq-3",
        pergunta: "Qual a área de atendimento?",
        resposta: "Atendemos Arapiraca - AL e região. Consulte para outras localidades.",
      },
      {
        id: "faq-4",
        pergunta: "Quais as formas de pagamento?",
        resposta: "Pix, cartão de crédito e débito. O restante pode ser pago até a data do evento.",
      },
      {
        id: "faq-5",
        pergunta: "Qual a política de cancelamento?",
        resposta: "Cancelamentos com antecedência permitem remarcar a data. Consulte as condições no orçamento.",
      },
      {
        id: "faq-6",
        pergunta: "Existe taxa de entrega?",
        resposta: "A taxa varia conforme a distância e é informada já no orçamento. A data e o horário de entrega e retirada são combinados por mensagem.",
      },
    ],
    btnText: "Tirar dúvidas no WhatsApp",
    btnUrl: "https://wa.me/message/CGSSC2KWYNFTG1",
    showBtn: true,
  },
  contact: {
    kicker: "Vamos conversar",
    title: "Peça seu orçamento",
    description: "Preencha os dados: sua mensagem é copiada e o WhatsApp abre pronto para você colar.",
    showInstagram: true,
    showPhone: true,
    showAddress: true,
    formButtonText: "Enviar pelo WhatsApp",
    successMessage: "Prontinho! Sua mensagem foi copiada — é só colar (Ctrl+V) na conversa que abriu.",
  },
  footer: {
    hoursTitle: "Horário de atendimento",
    hoursText: "Seg a Sex: 9h às 18h · Sáb: 9h às 13h",
    copyrightText: "Todos os direitos reservados.",
    showInstagram: true,
    showWhatsapp: true,
  },
  floatingWhatsapp: {
    isVisible: true,
    size: "md",
    position: "bottom-right",
    directLink: "https://wa.me/message/CGSSC2KWYNFTG1",
    tooltipText: "Falar no WhatsApp",
  },
  customSections: [],
  globalStyles: {
    siteTitleScale: "normal",
    logoSizePx: 40,
    borderRadius: "rounded-3xl",
    fontFamily: "poppins",
    adminButtonFloating: true,
  },
};

// ====== GERENCIADOR DE ARMAZENAMENTO ======

const STORAGE_KEY = "mv_decoracoes_cms_content_v2";
const EVENT_NAME = "mv_decoracoes_content_updated";

/**
 * Nomes e categorias das fotos do catálogo são definitivos: vêm de
 * src/assets/photos.ts (conferidos pelo cliente). Rascunhos antigos salvos no
 * LocalStorage não podem sobrescrevê-los.
 */
const FOTOS_DEFINITIVAS = new Map(defaultFotos.map((f) => [f.n, f]));

export function withDefinitiveGalleryNames(galleryFotos: GalleryPhotoItem[]): GalleryPhotoItem[] {
  return galleryFotos.map((f) => {
    const base = FOTOS_DEFINITIVAS.get(f.n);
    return base ? { ...f, nome: base.nome, cat: base.cat } : f;
  });
}

/**
 * Carrega o conteúdo salvo no LocalStorage com mesclagem segura nos padrões
 */
export function getStoredContent(): SiteContent {
  if (typeof window === "undefined") {
    return DEFAULT_SITE_CONTENT;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SITE_CONTENT,
      ...parsed,
      business: { ...DEFAULT_SITE_CONTENT.business, ...(parsed.business || {}) },
      hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
      howItWorks: {
        ...DEFAULT_SITE_CONTENT.howItWorks,
        ...(parsed.howItWorks || {}),
        steps: parsed.howItWorks?.steps || DEFAULT_SITE_CONTENT.howItWorks.steps,
      },
      themesSection: {
        ...DEFAULT_SITE_CONTENT.themesSection,
        ...(parsed.themesSection || {}),
        temas: parsed.themesSection?.temas || DEFAULT_SITE_CONTENT.themesSection.temas,
        precos: parsed.themesSection?.precos || DEFAULT_SITE_CONTENT.themesSection.precos,
      },
      gallery: {
        ...DEFAULT_SITE_CONTENT.gallery,
        ...(parsed.gallery || {}),
        categories: parsed.gallery?.categories || DEFAULT_SITE_CONTENT.gallery.categories,
        fotos: parsed.gallery?.fotos || DEFAULT_SITE_CONTENT.gallery.fotos,
      },
      rentalSection: {
        ...DEFAULT_SITE_CONTENT.rentalSection,
        ...(parsed.rentalSection || {}),
        items: parsed.rentalSection?.items || DEFAULT_SITE_CONTENT.rentalSection.items,
      },
      features: {
        ...DEFAULT_SITE_CONTENT.features,
        ...(parsed.features || {}),
        items: parsed.features?.items || DEFAULT_SITE_CONTENT.features.items,
      },
      testimonials: {
        ...DEFAULT_SITE_CONTENT.testimonials,
        ...(parsed.testimonials || {}),
        items: parsed.testimonials?.items || DEFAULT_SITE_CONTENT.testimonials.items,
      },
      faq: {
        ...DEFAULT_SITE_CONTENT.faq,
        ...(parsed.faq || {}),
        items: parsed.faq?.items || DEFAULT_SITE_CONTENT.faq.items,
      },
      contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) },
      footer: { ...DEFAULT_SITE_CONTENT.footer, ...(parsed.footer || {}) },
      floatingWhatsapp: { ...DEFAULT_SITE_CONTENT.floatingWhatsapp, ...(parsed.floatingWhatsapp || {}) },
      navItems: parsed.navItems || DEFAULT_SITE_CONTENT.navItems,
      customSections: parsed.customSections || [],
      globalStyles: { ...DEFAULT_SITE_CONTENT.globalStyles, ...(parsed.globalStyles || {}) },
    };
  } catch (err) {
    console.error("Erro ao ler conteúdo salvo:", err);
    return DEFAULT_SITE_CONTENT;
  }
}

/**
 * Salva o conteúdo atualizado e notifica todos os componentes na página
 */
export function saveStoredContent(content: SiteContent): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: content }));
  } catch (err) {
    console.error("Erro ao salvar conteúdo:", err);
  }
}

/**
 * Restaura todas as informações para o estado padrão
 */
export function resetStoredContent(): SiteContent {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_SITE_CONTENT }));
  }
  return DEFAULT_SITE_CONTENT;
}

/**
 * Exporta os dados como arquivo JSON baixável
 */
export function exportContentJson(content: SiteContent): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `mv-decoracoes-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Importa os dados a partir de um JSON
 */
export function importContentJson(jsonString: string): SiteContent {
  const parsed = JSON.parse(jsonString);
  const validated: SiteContent = {
    ...DEFAULT_SITE_CONTENT,
    ...parsed,
  };
  saveStoredContent(validated);
  return validated;
}

/**
 * Hook reativo para usar o conteúdo do site em qualquer componente
 */
export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(() => getStoredContent());

  useEffect(() => {
    // Sincroniza no mount
    setContent(getStoredContent());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContent>;
      if (customEvent.detail) {
        setContent(customEvent.detail);
      } else {
        setContent(getStoredContent());
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    content,
    save: (newContent: SiteContent) => {
      setContent(newContent);
      saveStoredContent(newContent);
    },
    reset: () => {
      const def = resetStoredContent();
      setContent(def);
    },
  };
}

/**
 * Helper para carregar arquivo de imagem do computador e converter para data URL (Base64)
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
