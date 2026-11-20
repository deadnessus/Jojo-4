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

test('o botão de atirar fica na direita; a esquerda só se escolher nas Opções', () => {
  assert.equal(validarConfig(null).atirar, 'direita');
  assert.equal(validarConfig({ versao: 1, atirar: 'esquerda' }).atirar, 'direita', 'opções antigas voltam para a direita');
  assert.equal(validarConfig({ versao: PADRAO.versao, atirar: 'esquerda' }).atirar, 'esquerda');
});
