import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { PERMISSIONS } from './permissions.ts';
import { permissionGroup, permissionInfo, permissionLabel } from './permissionLabels.ts';

describe('permissões em português', () => {
  it('toda permissão do sistema tem rótulo e explicação', () => {
    for (const permission of Object.values(PERMISSIONS)) {
      assert.ok(permissionInfo[permission], `sem tradução: ${permission}`);
      assert.notEqual(permissionLabel(permission), permission);
      assert.ok(permissionInfo[permission].description.length > 10);
    }
  });

  it('o grupo vem traduzido e o desconhecido cai no código', () => {
    assert.equal(permissionGroup('finance'), 'Financeiro');
    assert.equal(permissionGroup('novo'), 'novo');
    assert.equal(permissionLabel('novo.algo'), 'novo.algo');
  });
});
