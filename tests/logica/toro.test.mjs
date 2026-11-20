import { test } from 'node:test';
import assert from 'node:assert/strict';
import { embrulhar, delta, maisPerto } from '../../src/logica/toro.js';

test('embrulhar leva para dentro do mundo', () => {
  assert.equal(embrulhar(0, 512), 0);
  assert.equal(embrulhar(256, 512), -256);
  assert.equal(embrulhar(300, 512), -212);
  assert.equal(embrulhar(-300, 512), 212);
  assert.equal(embrulhar(1000, 512), -24);
});

test('a distância mais curta passa pela emenda quando é mais perto', () => {
  assert.equal(delta(250, -250, 512), 12);
  assert.equal(delta(-250, 250, 512), -12);
  assert.equal(delta(10, 30, 512), 20);
  assert.equal(maisPerto(-250, 250, 512), 262);
});
