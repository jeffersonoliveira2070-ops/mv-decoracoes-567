import { describe, expect, it } from "vitest";
import {
  formatWhatsappAvailabilityLink,
  formatWhatsappGeneralLink,
  normalizePhoneNumber,
  DEFAULT_PHONE,
} from "@/lib/whatsapp";
import { nomesPorFoto, fotos } from "@/assets/photos";

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

  it("mapeia os nomes específicos das fotos corretamente", () => {
    expect(nomesPorFoto[1]).toBe("Homem-Aranha Clássico");
    expect(nomesPorFoto[10]).toBe("Futebol Corinthians");
    expect(nomesPorFoto[16]).toBe("Chá de Bebê Ursinho Baloeiro");
    expect(nomesPorFoto[26]).toBe("Painel Happy Birthday Rosé");
  });

  it("garante que todas as fotos da galeria possuem URLs válidas que iniciam com http ou https", () => {
    expect(fotos.length).toBe(45);
    for (const f of fotos) {
      expect(f.img).toMatch(/^https?:\/\//);
      expect(f.img).not.toContain("SEU_PROJETO");
    }
  });
});
