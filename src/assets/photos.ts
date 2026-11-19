// Fotos reais enviadas pelo cliente (45 fotos), servidas via CDN.
const foto01 = { url: "/mv-imagens/foto-01.jpg" };
const foto02 = { url: "/mv-imagens/foto-02.jpg" };
const foto03 = { url: "/mv-imagens/foto-03.jpg" };
const foto04 = { url: "/mv-imagens/foto-04.jpg" };
const foto05 = { url: "/mv-imagens/foto-05.jpg" };
const foto06 = { url: "/mv-imagens/foto-06.jpg" };
const foto07 = { url: "/mv-imagens/foto-07.jpg" };
const foto08 = { url: "/mv-imagens/foto-08.jpg" };
const foto09 = { url: "/mv-imagens/foto-09.jpg" };
const foto10 = { url: "/mv-imagens/foto-10.jpg" };
const foto11 = { url: "/mv-imagens/foto-11.jpg" };
const foto12 = { url: "/mv-imagens/foto-12.jpg" };
const foto13 = { url: "/mv-imagens/foto-13.jpg" };
const foto14 = { url: "/mv-imagens/foto-14.jpg" };
const foto15 = { url: "/mv-imagens/foto-15.jpg" };
const foto16 = { url: "/mv-imagens/foto-16.jpg" };
const foto17 = { url: "/mv-imagens/foto-17.jpg" };
const foto18 = { url: "/mv-imagens/foto-18.jpg" };
const foto19 = { url: "/mv-imagens/foto-19.jpg" };
const foto20 = { url: "/mv-imagens/foto-20.jpg" };
const foto21 = { url: "/mv-imagens/foto-21.jpg" };
const foto22 = { url: "/mv-imagens/foto-22.jpg" };
const foto23 = { url: "/mv-imagens/foto-23.jpg" };
const foto24 = { url: "/mv-imagens/foto-24.jpg" };
const foto25 = { url: "/mv-imagens/foto-25.jpg" };
const foto26 = { url: "/mv-imagens/foto-26.jpg" };
const foto27 = { url: "/mv-imagens/foto-27.jpg" };
const foto28 = { url: "/mv-imagens/foto-28.jpg" };
const foto29 = { url: "/mv-imagens/foto-29.jpg" };
const foto30 = { url: "/mv-imagens/foto-30.jpg" };
const foto31 = { url: "/mv-imagens/foto-31.jpg" };
const foto32 = { url: "/mv-imagens/foto-32.jpg" };
const foto33 = { url: "/mv-imagens/foto-33.jpg" };
const foto34 = { url: "/mv-imagens/foto-34.jpg" };
const foto35 = { url: "/mv-imagens/foto-35.jpg" };
const foto36 = { url: "/mv-imagens/foto-36.jpg" };
const foto37 = { url: "/mv-imagens/foto-37.jpg" };
const foto38 = { url: "/mv-imagens/foto-38.jpg" };
const foto39 = { url: "/mv-imagens/foto-39.jpg" };
const foto40 = { url: "/mv-imagens/foto-40.jpg" };
const foto41 = { url: "/mv-imagens/foto-41.jpg" };
const foto42 = { url: "/mv-imagens/foto-42.jpg" };
const foto43 = { url: "/mv-imagens/foto-43.jpg" };
const foto44 = { url: "/mv-imagens/foto-44.jpg" };
const foto45 = { url: "/mv-imagens/foto-45.jpg" };

export type Cat = "Infantil" | "Bebê & Mesversário" | "Esportes" | "Adulto";

const F = [
  foto01,
  foto02,
  foto03,
  foto04,
  foto05,
  foto06,
  foto07,
  foto08,
  foto09,
  foto10,
  foto11,
  foto12,
  foto13,
  foto14,
  foto15,
  foto16,
  foto17,
  foto18,
  foto19,
  foto20,
  foto21,
  foto22,
  foto23,
  foto24,
  foto25,
  foto26,
  foto27,
  foto28,
  foto29,
  foto30,
  foto31,
  foto32,
  foto33,
  foto34,
  foto35,
  foto36,
  foto37,
  foto38,
  foto39,
  foto40,
  foto41,
  foto42,
  foto43,
  foto44,
  foto45,
];

const cats: Record<number, Cat> = {
  1: "Infantil",
  2: "Infantil",
  3: "Infantil",
  4: "Infantil",
  5: "Infantil",
  6: "Infantil",
  7: "Infantil",
  8: "Adulto",
  9: "Adulto",
  10: "Esportes",
  11: "Adulto",
  12: "Infantil",
  13: "Esportes",
  14: "Infantil",
  15: "Infantil",
  16: "Bebê & Mesversário",
  17: "Infantil",
  18: "Adulto",
  19: "Esportes",
  20: "Esportes",
  21: "Infantil",
  22: "Infantil",
  23: "Adulto",
  24: "Infantil",
  25: "Adulto",
  26: "Adulto",
  27: "Bebê & Mesversário",
  28: "Adulto",
  29: "Esportes",
  30: "Infantil",
  31: "Infantil",
  32: "Infantil",
  33: "Infantil",
  34: "Infantil",
  35: "Esportes",
  36: "Infantil",
  37: "Infantil",
  38: "Esportes",
  39: "Infantil",
  40: "Infantil",
  41: "Infantil",
  42: "Bebê & Mesversário",
  43: "Esportes",
  44: "Infantil",
  45: "Adulto",
};

export const nomesPorFoto: Record<number, string> = {
  1: "Homem-Aranha",
  2: "Patrulha Canina",
  3: "Louise Presidente",
  4: "Carros — Relâmpago McQueen",
  5: "Cereja",
  6: "Homem-Aranha",
  7: "365 sorrisos",
  8: "Rosé Gold & Balões Orgânicos",
  9: "Cereja",
  10: "Futebol Corinthians",
  11: "Branco & Rosa Sofisticado",
  12: "Lilo & Stitch Tropical",
  13: "Futebol Flamengo Rubro-Negro",
  14: "Lilo & Stitch / Flamengo",
  15: "Eu sou um milagre",
  16: "Chá de Bebê Ursinho Baloeiro",
  17: "A Princesa e o Sapo",
  18: "Arco & Balões Rosas",
  19: "Futebol Campeões Brasil",
  20: "Futebol",
  21: "Spider-Man",
  22: "Dora, a Aventureira",
  23: "Branco & Rosa Elegance",
  24: "Toy Story & balões",
  25: "Marrom & Rosé Suave",
  26: "Painel Happy Birthday Rosé",
  27: "Chá de Bebê Nuvem de Amor",
  28: "30 Anos com Painel Redondo",
  29: "CR7",
  30: "Preto e Amarelo",
  31: "Homem de Ferro",
  32: "Hulk",
  33: "A Casa Mágica da Gabby",
  34: "Moana Baby",
  35: "CR7",
  36: "Minnie Mouse",
  37: "O maior pintor do mundo",
  38: "Futebol",
  39: "A Casa Mágica da Gabby",
  40: "Branca de Neve Salão Completo",
  41: "Floresta dos Bichinhos",
  42: "Vaquinha Tetê",
  43: "Futebol Society Bola na Rede",
  44: "Jesus",
  45: "50 Anos Dourado Real",
};


/**
 * Resolve caminhos de assets do Lovable (ex: /__l5e/...) para a URL pública do CDN,
 * garantindo carregamento direto em qualquer host (localhost, mvdecoracoes.local ou produção).
 */
export function resolveAssetUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (url.startsWith("/__l5e/assets-v1/")) {
    return `https://id-preview-4d9b5f56--16965489-0e31-494f-81cd-307c92933467.lovable.app${url}`;
  }
  return url;
}

export const fotos = F.map((a, i) => {
  const n = i + 1;
  const cat = cats[n] || "Infantil";
  return {
    n,
    img: resolveAssetUrl(a.url as string),
    cat,
    nome: nomesPorFoto[n] || `Decoração ${cat} #${n}`,
  };
});


const kit10 = { url: "/mv-imagens/foto-10.jpg" };
const kit12 = { url: "/mv-imagens/foto-12.jpg" };
const kit16 = { url: "/mv-imagens/foto-16.jpg" };
const kit18 = { url: "/mv-imagens/foto-18.jpg" };
const kit25 = { url: "/mv-imagens/foto-25.jpg" };
const kit40 = { url: "/mv-imagens/foto-40.jpg" };

// Destaques (versões tratadas para os cartões de kits)
export const heroFoto = resolveAssetUrl(fotos[25]!.img); // foto-26 — painel rosa "Happy Birthday"
export const stitch = resolveAssetUrl(kit12.url as string); // foto-12
export const ursos = resolveAssetUrl(kit16.url as string); // foto-16
export const corinthians = resolveAssetUrl(kit10.url as string); // foto-10
export const eleganteMarrom = resolveAssetUrl(kit25.url as string); // foto-25
export const salaoBrancaDeNeves = resolveAssetUrl(kit40.url as string); // foto-40
export const arcoNeon = resolveAssetUrl(kit18.url as string); // foto-18
