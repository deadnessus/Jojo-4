import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vetorJoystick, seguirBase, giroDoArrasto } from '../../src/logica/joystick.js';

test('zona morta: dedo quase parado não anda', () => {
  assert.deepEqual(vetorJoystick(3, -4, 60), { x: 0, y: 0, mag: 0 });
});

test('dedo para cima anda para a frente; na borda chega a 1', () => {
  const v = vetorJoystick(0, -60, 60);
  assert.ok(Math.abs(v.y - 1) < 1e-9 && Math.abs(v.x) < 1e-9 && Math.abs(v.mag - 1) < 1e-9);
  const longe = vetorJoystick(300, 0, 60);
  assert.ok(Math.abs(longe.mag - 1) < 1e-9 && longe.x > 0.99);
  const meio = vetorJoystick(0, -30, 60);
  assert.ok(meio.mag > 0.3 && meio.mag < 0.6);
});

test('a base segue o dedo quando ele passa do raio', () => {
  assert.deepEqual(seguirBase(100, 100, 120, 100, 60), [100, 100]);
  const [bx, by] = seguirBase(100, 100, 200, 100, 60);
  assert.ok(Math.abs(bx - 140) < 1e-9 && by === 100);
});

test('arrasto rápido gira mais que o devagar', () => {
  const devagar = giroDoArrasto(40, 200, 5);
  const rapido = giroDoArrasto(40, 10, 5);
  assert.ok(rapido > devagar && devagar > 0);
  assert.ok(giroDoArrasto(-40, 200, 5) < 0);
});
