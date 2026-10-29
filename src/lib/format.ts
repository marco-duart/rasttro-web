export function formatCentsToBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * A API manda campos que são só data (vencimento, mês de referência, entrada no clube) como "2026-10-10", sem hora.
 * Esse texto vira o dia local: com `new Date('2026-10-10')` o navegador lê como meia-noite UTC e, no horário de
 * Brasília, mostra o dia anterior.
 */
function parseDate(iso: string): Date {
  // Também aceita o formato antigo da API ("2026-10-10T00:00:00.000Z" = meia-noite UTC): assim a ordem do deploy não importa.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})(?:T00:00:00(?:\.000)?Z)?$/.exec(iso);
  return dateOnly ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])) : new Date(iso);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return parseDate(iso).toLocaleDateString('pt-BR');
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

/** "Outubro de 2026": só a primeira letra maiúscula (o `capitalize` do CSS deixava "De" também). */
export function formatMonth(iso: string | null | undefined): string {
  if (!iso) return '—';
  const text = parseDate(iso).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}
