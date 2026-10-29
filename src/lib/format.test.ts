import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

// O bug aparecia no horário de Brasília: "2026-10-10" virava 09/10.
process.env.TZ = 'America/Sao_Paulo';

const { formatDate, formatMonth } = await import('./format.ts');

describe('datas que vêm só como dia', () => {
  it('formatDate mostra o mesmo dia, sem deslocar pelo fuso', () => {
    assert.equal(formatDate('2026-10-10'), '10/10/2026');
    assert.equal(formatDate('2026-10-01'), '01/10/2026');
  });

  it('formatMonth mostra o mês certo, só com a primeira letra maiúscula', () => {
    assert.equal(formatMonth('2026-10-01'), 'Outubro de 2026');
    assert.equal(formatMonth('2026-09-01'), 'Setembro de 2026');
  });

  it('data com hora continua como antes', () => {
    assert.equal(formatDate('2026-10-10T15:00:00.000Z'), '10/10/2026');
  });

  it('formato antigo da API (meia-noite UTC) também mostra o dia certo', () => {
    assert.equal(formatDate('2026-10-10T00:00:00.000Z'), '10/10/2026');
    assert.equal(formatMonth('2026-10-01T00:00:00.000Z'), 'Outubro de 2026');
  });

  it('vazio vira traço', () => {
    assert.equal(formatDate(null), '—');
    assert.equal(formatMonth(undefined), '—');
  });
});
