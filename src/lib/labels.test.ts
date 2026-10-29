import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { announcementPriorityLabel, auditActionText, chargeStatusLabel, convoyParticipantStatusLabel, meetingStatusLabel } from './labels.ts';

describe('rótulos dos enums', () => {
  it('nenhum rótulo é o código cru em inglês', () => {
    for (const map of [chargeStatusLabel, meetingStatusLabel, convoyParticipantStatusLabel, announcementPriorityLabel]) {
      for (const [code, label] of Object.entries(map)) assert.notEqual(label, code);
    }
  });

  it('ação da auditoria traduzida e ação desconhecida preservada', () => {
    assert.equal(auditActionText('convoy.emergency_sheet.viewed'), 'Ficha de emergência do comboio aberta');
    assert.equal(auditActionText('algo.novo'), 'algo.novo');
  });
});
