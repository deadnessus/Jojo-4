import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PADRAO, validarConfig } from '../../src/logica/config.js';

test('valores estranhos voltam para o padrão', () => {
  assert.deepEqual(validarConfig(null), { ...PADRAO });
  const c = validarConfig({ sensibilidade: 99, volume: -1, visual: 'neon', mira: 'forte', inverterY: 'sim', botoes: 'grande' });
  assert.equal(c.sensibilidade, PADRAO.sensibilidade);
  assert.equal(c.volume, PADRAO.volume);
  assert.equal(c.visual, PADRAO.visual);
  assert.equal(c.mira, 'forte');
  assert.equal(c.inverterY, false);
  assert.equal(c.botoes, 'grande');
});
