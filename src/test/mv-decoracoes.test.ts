import { describe, expect, it } from "vitest";
import {
  formatWhatsappAvailabilityLink,
  formatWhatsappGeneralLink,
  normalizePhoneNumber,
  DEFAULT_PHONE,
} from "@/lib/whatsapp";
import { nomesPorFoto, fotos } from "@/assets/photos";
import { getStoredContent, type SiteContent } from "@/lib/contentStore";

describe("MV Decorações - Regras de Negócio e WhatsApp", () => {
  it("normaliza corretamente o número comercial para padrão internacional (55 + DDD + Número)", () => {
    expect(normalizePhoneNumber("(82) 98769-3821")).toBe("5582987693821");
    expect(normalizePhoneNumber("82987693821")).toBe("5582987693821");
    expect(normalizePhoneNumber("5582987693821")).toBe("5582987693821");
    expect(normalizePhoneNumber("")).toBe(DEFAULT_PHONE);
  });

  it("gera o link de disponibilidade no WhatsApp com a mensagem personalizada contendo o nome real da decoração", () => {
    const nomeDecoracao = "Homem-Aranha Clássico";
    const link = formatWhatsappAvailabilityLink(nomeDecoracao, "(82) 98769-3821");

    expect(link).toContain("https://wa.me/5582987693821?text=");
    
    // Mensagem esperada conforme especificação:
    // "Olá! Vi a decoração [NOME DA DECORAÇÃO] no site da MV Decorações e gostaria de saber se ela está disponível para a data do meu evento. Poderiam me passar mais informações?"
    const mensagemDecodificada = decodeURIComponent(link.split("?text=")[1] || "");
    expect(mensagemDecodificada).toBe(
      "Olá! Vi a decoração Homem-Aranha Clássico no site da MV Decorações e gostaria de saber se ela está disponível para a data do meu evento. Poderiam me passar mais informações?"
    );
  });

  it("possui catálogo com decorações reais e categorias válidas", () => {
    expect(fotos.length).toBeGreaterThan(0);
    const categoriasValidas = ["Infantil", "Bebê & Mesversário", "Esportes", "Adulto"];

    for (const f of fotos) {
      expect(categoriasValidas).toContain(f.cat);
      expect(f.nome).toBeTruthy();
      expect(f.img).toBeTruthy();
    }
  });

  it("mapeia os nomes definitivos das fotos corretamente", () => {
    expect(nomesPorFoto[1]).toBe("Homem-Aranha");
    expect(nomesPorFoto[2]).toBe("Patrulha Canina");
    expect(nomesPorFoto[10]).toBe("Futebol Corinthians");
    expect(nomesPorFoto[14]).toBe("Lilo & Stitch / Flamengo");
    expect(nomesPorFoto[16]).toBe("Chá de Bebê Ursinho Baloeiro");
    expect(nomesPorFoto[26]).toBe("Painel Happy Birthday Rosé");
    expect(nomesPorFoto[42]).toBe("Vaquinha Tetê");
    expect(nomesPorFoto[44]).toBe("Jesus");
  });

  it("usa os nomes e categorias definitivos na galeria, sem espaços nas pontas", () => {
    expect(fotos.length).toBe(45);
    for (const f of fotos) {
      expect(f.nome).toBe(nomesPorFoto[f.n]);
      expect(f.nome).toBe(f.nome.trim());
      expect(f.nome.length).toBeGreaterThan(0);
    }
    expect(fotos.find((f) => f.n === 44)?.nome).toBe("Jesus");
    expect(fotos.find((f) => f.n === 44)?.cat).toBe("Infantil");
    expect(fotos.find((f) => f.n === 29)?.cat).toBe("Esportes");
    expect(fotos.find((f) => f.n === 26)?.cat).toBe("Adulto");
    expect(fotos.find((f) => f.n === 42)?.cat).toBe("Bebê & Mesversário");
  });

  it("garante que todas as fotos da galeria possuem URLs de asset válidas", () => {
    expect(fotos.length).toBe(45);
    for (const f of fotos) {
      expect(f.img).toMatch(/^(https?:\/\/|\/__l5e\/)/);
      expect(f.img).not.toContain("SEU_PROJETO");
    }
  });
  it("não deixa nomes antigos salvos no navegador sobrescreverem os nomes definitivos", () => {
    const CHAVE = "mv_decoracoes_cms_content_v2";
    const antigo = JSON.parse(JSON.stringify(getStoredContent())) as SiteContent;
    antigo.gallery.fotos = antigo.gallery.fotos.map((f) => ({
      ...f,
      nome: f.n === 44 ? "Nome Antigo da Auditoria" : f.nome ?? "Sem nome",
      cat: f.n === 44 ? "Adulto" : f.cat,
    }));
    localStorage.setItem(CHAVE, JSON.stringify(antigo));

    const recarregado = getStoredContent();
    expect(recarregado.gallery.fotos.find((f) => f.n === 44)?.nome).toBe("Jesus");
    expect(recarregado.gallery.fotos.find((f) => f.n === 44)?.cat).toBe("Infantil");

    localStorage.removeItem(CHAVE);
  });
});
