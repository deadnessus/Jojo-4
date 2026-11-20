import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarAleatorio, ruido2, fbm } from '../../src/logica/ruido.js';

test('o mesmo número de semente gera a mesma sequência', () => {
  const a = criarAleatorio(42), b = criarAleatorio(42), c = criarAleatorio(43);
  const sa = [a(), a(), a()], sb = [b(), b(), b()];
  assert.deepEqual(sa, sb);
  assert.notDeepEqual(sa, [c(), c(), c()]);
  for (const v of sa) assert.ok(v >= 0 && v < 1);
});

test('ruído fica entre -1 e 1 e é contínuo', () => {
  let min = 1, max = -1;
  for (let i = 0; i < 4000; i++) {
    const x = i * 0.137, y = i * 0.071;
    const v = ruido2(x, y, 7);
    min = Math.min(min, v); max = Math.max(max, v);
    assert.ok(Math.abs(ruido2(x + 0.001, y, 7) - v) < 0.02, 'ruído deu um pulo');
  }
  assert.ok(min >= -1 && max <= 1);
  assert.ok(max - min > 0.8, 'ruído quase sem variação');
  const f = fbm(3.3, 9.1, 5);
  assert.ok(f >= -1 && f <= 1);
});
