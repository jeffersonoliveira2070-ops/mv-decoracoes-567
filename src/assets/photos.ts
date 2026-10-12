// Fotos reais enviadas pelo cliente (45 fotos), servidas via CDN.
import foto01 from "./foto-01.jpg.asset.json";
import foto02 from "./foto-02.jpg.asset.json";
import foto03 from "./foto-03.jpg.asset.json";
import foto04 from "./foto-04.jpg.asset.json";
import foto05 from "./foto-05.jpg.asset.json";
import foto06 from "./foto-06.jpg.asset.json";
import foto07 from "./foto-07.jpg.asset.json";
import foto08 from "./foto-08.jpg.asset.json";
import foto09 from "./foto-09.jpg.asset.json";
import foto10 from "./foto-10.jpg.asset.json";
import foto11 from "./foto-11.jpg.asset.json";
import foto12 from "./foto-12.jpg.asset.json";
import foto13 from "./foto-13.jpg.asset.json";
import foto14 from "./foto-14.jpg.asset.json";
import foto15 from "./foto-15.jpg.asset.json";
import foto16 from "./foto-16.jpg.asset.json";
import foto17 from "./foto-17.jpg.asset.json";
import foto18 from "./foto-18.jpg.asset.json";
import foto19 from "./foto-19.jpg.asset.json";
import foto20 from "./foto-20.jpg.asset.json";
import foto21 from "./foto-21.jpg.asset.json";
import foto22 from "./foto-22.jpg.asset.json";
import foto23 from "./foto-23.jpg.asset.json";
import foto24 from "./foto-24.jpg.asset.json";
import foto25 from "./foto-25.jpg.asset.json";
import foto26 from "./foto-26.jpg.asset.json";
import foto27 from "./foto-27.jpg.asset.json";
import foto28 from "./foto-28.jpg.asset.json";
import foto29 from "./foto-29.jpg.asset.json";
import foto30 from "./foto-30.jpg.asset.json";
import foto31 from "./foto-31.jpg.asset.json";
import foto32 from "./foto-32.jpg.asset.json";
import foto33 from "./foto-33.jpg.asset.json";
import foto34 from "./foto-34.jpg.asset.json";
import foto35 from "./foto-35.jpg.asset.json";
import foto36 from "./foto-36.jpg.asset.json";
import foto37 from "./foto-37.jpg.asset.json";
import foto38 from "./foto-38.jpg.asset.json";
import foto39 from "./foto-39.jpg.asset.json";
import foto40 from "./foto-40.jpg.asset.json";
import foto41 from "./foto-41.jpg.asset.json";
import foto42 from "./foto-42.jpg.asset.json";
import foto43 from "./foto-43.jpg.asset.json";
import foto44 from "./foto-44.jpg.asset.json";
import foto45 from "./foto-45.jpg.asset.json";

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
  1: "Homem-Aranha Clássico",
  2: "Realeza Azul & Dourado",
  3: "Safari Baby Menino",
  4: "Mickey Mouse Tradicional",
  5: "Minnie Rosa & Dourado",
  6: "Patrulha Canina Aventura",
  7: "Fazendinha do Menino",
  8: "Rosé Gold & Balões Orgânicos",
  9: "Dourado Glamour Adulto",
  10: "Futebol Corinthians",
  11: "Preto & Dourado Sofisticado",
  12: "Lilo & Stitch Tropical",
  13: "Futebol Flamengo Rubro-Negro",
  14: "Dinossauros & Jurassic World",
  15: "Astronauta & Galáxia Espacial",
  16: "Chá de Bebê Ursinho Baloeiro",
  17: "Fundo do Mar Encantado",
  18: "Arco Neon & Balões Coloridos",
  19: "Futebol Campeões Brasil",
  20: "Futebol Palmeiras Alviverde",
  21: "Princesas Disney Jardim",
  22: "Bosque Encantado Animais",
  23: "Branco & Prata Elegance",
  24: "Carros & Pista de Corrida",
  25: "Marrom & Rosé Suave",
  26: "Painel Happy Birthday Rosé",
  27: "Chá de Bebê Nuvem de Amor",
  28: "30 Anos com Painel Redondo",
  29: "Basquete & Esportes Radicais",
  30: "Circo Mágico Vintage",
  31: "Toy Story Aventura",
  32: "Unicórnio Candy Colors",
  33: "Vingadores & Super-Heróis",
  34: "Mundo Bita na Fazendinha",
  35: "Futebol Vasco Cruzmaltino",
  36: "Borboletas & Jardim Encantado",
  37: "Sereia & Ariel Fundo do Mar",
  38: "Futebol São Paulo Tricolor",
  39: "Safari Menina Rosa",
  40: "Branca de Neve Salão Completo",
  41: "Floresta dos Bichinhos",
  42: "Chá Revelação Ursinhos Azul & Rosa",
  43: "Futebol Society Bola na Rede",
  44: "Sonic the Hedgehog Speed",
  45: "50 Anos Dourado Real",
};

const LOVABLE_CDN_ORIGIN = "https://pixel-perfect-builder-567.lovable.app";

/**
 * Resolve caminhos de assets do Lovable (ex: /__l5e/...) para a URL pública do CDN,
 * garantindo carregamento direto em qualquer host (localhost, mvdecoracoes.local ou produção).
 */
export function resolveAssetUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (url.startsWith("/__l5e/")) {
    return `${LOVABLE_CDN_ORIGIN}${url}`;
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

import kit10 from "./kit-10.jpg.asset.json";
import kit12 from "./kit-12.jpg.asset.json";
import kit16 from "./kit-16.jpg.asset.json";
import kit18 from "./kit-18.jpg.asset.json";
import kit25 from "./kit-25.jpg.asset.json";
import kit40 from "./kit-40.jpg.asset.json";

// Destaques (versões tratadas para os cartões de kits)
export const heroFoto = resolveAssetUrl(fotos[25]!.img); // foto-26 — painel rosa "Happy Birthday"
export const stitch = resolveAssetUrl(kit12.url as string); // foto-12
export const ursos = resolveAssetUrl(kit16.url as string); // foto-16
export const corinthians = resolveAssetUrl(kit10.url as string); // foto-10
export const eleganteMarrom = resolveAssetUrl(kit25.url as string); // foto-25
export const salaoBrancaDeNeves = resolveAssetUrl(kit40.url as string); // foto-40
export const arcoNeon = resolveAssetUrl(kit18.url as string); // foto-18
