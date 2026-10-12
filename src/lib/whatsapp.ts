// ====== HELPER CENTRALIZADO DE WHATSAPP ======
//
// Formata números e links de contato direto com mensagens pré-configuradas.

export const DEFAULT_PHONE = "5582987693821";
export const DEFAULT_WA_SHORT = "https://wa.me/message/CGSSC2KWYNFTG1";

/**
 * Limpa e padroniza o telefone no formato internacional (55 + DDD + Número)
 */
export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return DEFAULT_PHONE;
  if (digits.startsWith("55")) return digits;
  return `55${digits}`;
}

/**
 * Cria o link do WhatsApp com mensagem de disponibilidade personalizada para uma decoração específica.
 *
 * Mensagem gerada:
 * "Olá! Vi a decoração [NOME DA DECORAÇÃO] no site da MV Decorações e gostaria de saber se ela está disponível para a data do meu evento. Poderiam me passar mais informações?"
 */
export function formatWhatsappAvailabilityLink(
  decoracaoNome: string,
  telefone: string = DEFAULT_PHONE,
): string {
  const phone = normalizePhoneNumber(telefone);
  const msg = `Olá! Vi a decoração ${decoracaoNome} no site da MV Decorações e gostaria de saber se ela está disponível para a data do meu evento. Poderiam me passar mais informações?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

/**
 * Cria o link de WhatsApp para pedido geral de orçamento.
 */
export function formatWhatsappGeneralLink(
  telefone: string = DEFAULT_PHONE,
  mensagemPersonalizada?: string,
): string {
  const phone = normalizePhoneNumber(telefone);
  const msg =
    mensagemPersonalizada ||
    "Olá! Gostaria de pedir um orçamento para o meu evento com a MV Decorações em Arapiraca.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}
