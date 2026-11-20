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

test('o botão de atirar fica na esquerda; a direita só se escolher nas Opções', () => {
  assert.equal(validarConfig(null).atirar, 'esquerda');
  assert.equal(validarConfig({ versao: 2, atirar: 'direita' }).atirar, 'esquerda', 'opções antigas vão para a esquerda');
  assert.equal(validarConfig({ versao: PADRAO.versao, atirar: 'direita' }).atirar, 'direita');
});
