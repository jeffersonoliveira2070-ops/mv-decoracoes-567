// Fotos reais da MV Decorações servidas pela pasta public/fotos.

export type Cat = "Infantil" | "Bebê & Mesversário" | "Esportes" | "Adulto";

const F = Array.from({ length: 45 }, (_, i) => `/fotos/foto-${String(i + 1).padStart(2, "0")}.jpg`);

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


/** Resolve caminhos de fotos locais publicados em /public/fotos. */
export function resolveAssetUrl(url: string | undefined | null): string {
  return url || "";
}

export const fotos = F.map((a, i) => {
  const n = i + 1;
  const cat = cats[n] || "Infantil";
  return {
    n,
    img: a,
    cat,
    nome: nomesPorFoto[n] || `Decoração ${cat} #${n}`,
  };
});


// Destaques (versões tratadas para os cartões de kits)
export const heroFoto = resolveAssetUrl(fotos[25]!.img); // foto-26 — painel rosa "Happy Birthday"
export const stitch = "/fotos/foto-12.jpg"; // foto-12
export const ursos = "/fotos/foto-16.jpg"; // foto-16
export const corinthians = "/fotos/foto-10.jpg"; // foto-10
export const eleganteMarrom = "/fotos/foto-25.jpg"; // foto-25
export const salaoBrancaDeNeves = "/fotos/foto-40.jpg"; // foto-40
export const arcoNeon = "/fotos/foto-18.jpg"; // foto-18
