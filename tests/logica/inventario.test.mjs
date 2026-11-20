import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarInventario, podeCriar, criar } from '../../src/logica/inventario.js';
import { RECEITAS, ITENS, COLETA } from '../../src/dados/itens.js';
import { montarSave, validarSave } from '../../src/logica/save.js';

const receita = (id) => RECEITAS.find((r) => r.id === id);

test('mochila soma, tira e não aceita item que não existe', () => {
  const inv = criarInventario();
  inv.adicionar('madeira', 3);
  inv.adicionar('madeira', 2);
  inv.adicionar('ouro_falso', 5);
  assert.equal(inv.quantos('madeira'), 5);
  assert.equal(inv.quantos('ouro_falso'), 0);
  assert.equal(inv.remover('madeira', 6), false);
  assert.equal(inv.remover('madeira', 5), true);
  assert.equal(inv.tem('madeira'), false);
});

test('criar machado: precisa dos ingredientes, gasta e só faz um', () => {
  const inv = criarInventario([['madeira', 2], ['pedra', 1]]);
  const r = receita('machado');
  const antes = podeCriar(inv, r);
  assert.equal(antes.ok, false);
  assert.deepEqual(antes.faltando, [['pedra', 1], ['fibra', 1]]);
  inv.adicionar('pedra', 1); inv.adicionar('fibra', 1);
  assert.equal(criar(inv, r), true);
  assert.equal(inv.quantos('machado'), 1);
  assert.equal(inv.quantos('madeira'), 0);
  inv.adicionar('madeira', 2); inv.adicionar('pedra', 2); inv.adicionar('fibra', 1);
  assert.equal(podeCriar(inv, r).jaTem, true);
  assert.equal(criar(inv, r), false, 'ferramenta só precisa de uma');
});

test('blocos saem em dupla', () => {
  const inv = criarInventario([['madeira', 1]]);
  assert.equal(criar(inv, receita('bloco_madeira')), true);
  assert.equal(inv.quantos('bloco_madeira'), 2);
});

test('toda receita e toda coleta usam itens que existem, com no máximo 3 ingredientes', () => {
  for (const r of RECEITAS) {
    assert.ok(ITENS[r.resultado], r.id);
    assert.ok(Object.keys(r.custo).length <= 3, r.id);
    for (const id of Object.keys(r.custo)) assert.ok(ITENS[id], `${r.id}: ${id}`);
  }
  for (const [tipo, c] of Object.entries(COLETA)) for (const [id] of c.da) assert.ok(ITENS[id], `${tipo}: ${id}`);
});

test('save: guarda só códigos e números e recusa lixo', () => {
  const s = montarSave({ inventario: [['madeira', 4]], blocos: [['madeira', 3, -2, 320]], fogueiras: [[150, -220]], tempoJogado: 61.7 });
  const v = validarSave(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(v.inventario, [['madeira', 4]]);
  assert.deepEqual(v.blocos, [['madeira', 3, -2, 320]]);
  assert.equal(v.tempo_jogado_s, 61);
  const sujo = validarSave({ ...s, inventario: [['madeira', 4], ['<script>', 1], ['pedra', -3]], blocos: [['ouro', 1, 1, 1], ['pedra', 1.5, 0, 0]] });
  assert.deepEqual(sujo.inventario, [['madeira', 4]]);
  assert.deepEqual(sujo.blocos, []);
  assert.equal(validarSave({ jogo: 'outro', versao_save: 1 }), null);
  assert.deepEqual(validarSave({ ...s, pos: [1520, -330, 45] }).pos, [1520, -330, 45]);
  assert.equal(validarSave({ ...s, pos: [1.5, 0, 0] }).pos, null);
  const inv = criarInventario([['madeira', 3]]);
  inv.limpar();
  assert.equal(inv.lista().length, 0);
  assert.equal(validarSave('texto'), null);
});
