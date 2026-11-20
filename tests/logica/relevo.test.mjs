import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarRelevo, gerarGrade } from '../../src/logica/relevo.js';
import vale from '../../src/dados/regioes/vale.js';

const relevo = criarRelevo(vale);
const grade = gerarGrade(relevo, vale.passo);

test('a clareira da nave é plana', () => {
  for (const [x, z] of [[0, 0], [8, -6], [-10, 5], [12, 12]]) {
    assert.ok(Math.abs(relevo.altura(x, z) - 3.2) < 0.9, `clareira torta em ${x},${z}: ${relevo.altura(x, z)}`);
  }
});

test('o lago fica abaixo da água e o paredão da borda é alto', () => {
  assert.ok(relevo.altura(82, -52) < vale.nivelAgua - 3);
  assert.ok(relevo.altura(-190, 0) > relevo.altura(-120, 0) + 15);
  assert.ok(relevo.altura(0, 190) > 20);
});

test('o início do jogador fica em terra firme, fora da água', () => {
  assert.ok(grade.alturaEm(vale.inicio.x, vale.inicio.z) > vale.nivelAgua + 1);
});

test('a altura da grade bate com os pontos amostrados e é contínua', () => {
  const { n, passo, origem, alturas } = grade;
  for (const [i, j] of [[0, 0], [10, 20], [96, 96], [150, 33], [n - 1, n - 1]]) {
    const x = origem + i * passo, z = origem + j * passo;
    assert.ok(Math.abs(grade.alturaEm(x, z) - alturas[j * n + i]) < 1e-4);
  }
  for (let k = 0; k < 2000; k++) {
    const x = -150 + k * 0.15, z = 40 + Math.sin(k) * 30;
    assert.ok(Math.abs(grade.alturaEm(x + 0.01, z) - grade.alturaEm(x, z)) < 0.05);
  }
});

test('a normal aponta para cima e tem tamanho 1', () => {
  for (const [x, z] of [[0, 0], [50, 50], [-170, 20]]) {
    const [nx, ny, nz] = grade.normalEm(x, z);
    assert.ok(ny > 0);
    assert.ok(Math.abs(Math.hypot(nx, ny, nz) - 1) < 1e-6);
  }
});
