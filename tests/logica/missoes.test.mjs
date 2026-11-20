import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarMissoes } from '../../src/logica/missoes.js';
import { criarInventario } from '../../src/logica/inventario.js';
import { MISSOES, SISTEMAS } from '../../src/dados/missoes.js';
import { LOCAIS, PONTOS } from '../../src/dados/locais.js';
import { ITENS } from '../../src/dados/itens.js';
import { CRIATURAS } from '../../src/dados/criaturas.js';
import { montarSave, validarSave } from '../../src/logica/save.js';

const ctx = (local = null, fogueira = false) => ({ pertoDe: (l) => l === local, fogueiraPertoDaNave: fogueira });

test('a campanha é grande e todos os dados existem', () => {
  const passos = MISSOES.reduce((s, m) => s + m.passos.length, 0);
  assert.ok(MISSOES.length >= 12 && passos >= 45, `${MISSOES.length} missões, ${passos} passos`);
  for (const m of MISSOES) {
    if (m.sistema) assert.ok(SISTEMAS.some((s) => s.id === m.sistema), m.id);
    for (const p of m.passos) {
      if (p.local) assert.ok(LOCAIS[p.local], `${m.id}: local ${p.local}`);
      if (p.item) assert.ok(ITENS[p.item], `${m.id}: item ${p.item}`);
      if (p.tipo === 'achar') assert.ok(PONTOS[p.item], `${m.id}: pontos de ${p.item}`);
      if (p.bicho) assert.ok(CRIATURAS[p.bicho], `${m.id}: bicho ${p.bicho}`);
      if (p.chefe) assert.ok(CRIATURAS[p.chefe] && CRIATURAS[p.chefe].chefe, `${m.id}: chefe ${p.chefe}`);
      for (const id of Object.keys(p.itens || p.precisa || {})) assert.ok(ITENS[id], `${m.id}: ${id}`);
      assert.ok(p.texto && p.texto.length < 140, `${m.id}: texto curto`);
    }
  }
});

test('primeira missão: falar, ir, derrotar, pegar e instalar', () => {
  const inv = criarInventario();
  const ms = criarMissoes(null, inv);
  assert.equal(ms.passo().tipo, 'falar');
  assert.ok(ms.evento('falou').length > 0);
  assert.equal(ms.verificar(0.1, ctx()).length, 0, 'longe da colina não avança');
  ms.verificar(0.1, ctx('colina'));
  assert.equal(ms.passo().tipo, 'derrotar');
  const tag = ms.tag();
  for (let i = 0; i < 3; i++) ms.evento('derrotou', { tag });
  ms.evento('derrotou', { tag: 'outro:9' });
  assert.equal(ms.progresso(), '3/4');
  ms.evento('derrotou', { tag });
  assert.equal(ms.passo().tipo, 'pegar');
  ms.evento('pegou', { id: 'bateria' });
  inv.adicionar('bateria', 1);
  assert.equal(ms.podeInstalar().ok, true);
  const msgs = ms.instalar();
  assert.ok(msgs.some((m) => m.includes('Missão completa')));
  assert.equal(inv.quantos('bateria'), 0, 'instalar gasta a peça');
  assert.equal(ms.estado.sistemas.energia, 1);
  assert.equal(ms.missao().id, 'casco');
});

test('coletar, criar, achar e esperar o tanque', () => {
  const inv = criarInventario([['madeira', 24], ['pedra', 18], ['fibra', 8]]);
  const ms = criarMissoes({ m: 1, p: 0, n: 0, pegos: [], sistemas: [['energia', 1]], combustivel: 0, porta: false }, inv);
  ms.verificar(0.1, ctx());
  assert.equal(ms.passo().tipo, 'criar');
  inv.adicionar('remendo', 4);
  ms.verificar(0.1, ctx());
  assert.equal(ms.passo().tipo, 'instalar');
  ms.instalar();
  ms.verificar(0.1, ctx(null, true));
  assert.equal(ms.missao().id, 'bocal');

  const escudo = criarMissoes({ m: MISSOES.findIndex((m) => m.id === 'escudo'), p: 0, n: 0, pegos: [], sistemas: [], combustivel: 0, porta: false }, inv);
  escudo.evento('pegou', { id: 'placa:0' });
  escudo.evento('pegou', { id: 'placa:0' });
  assert.equal(escudo.progresso(), '🟧 1/6', 'a mesma placa não conta duas vezes');
  for (let i = 1; i < 6; i++) escudo.evento('pegou', { id: `placa:${i}` });
  assert.equal(escudo.passo().tipo, 'instalar');

  const comb = criarMissoes({ m: MISSOES.findIndex((m) => m.id === 'combustivel'), p: 3, n: 0, pegos: [], sistemas: [['combustivel', 1]], combustivel: 0, porta: false }, inv);
  assert.equal(comb.passo().tipo, 'esperar');
  for (let i = 0; i < 100; i++) comb.verificar(1, ctx());
  assert.equal(comb.passo().tipo, 'esperar', 'demora para encher');
  for (let i = 0; i < 300; i++) comb.verificar(1, ctx());
  assert.equal(comb.missao().id, 'navegacao');
});

test('receitas das missões só aparecem quando a missão chega', () => {
  const ms = criarMissoes(null, criarInventario());
  assert.equal(ms.receitaLiberada({ desde: 'combustivel' }), false);
  assert.equal(ms.receitaLiberada({}), true);
});

test('o progresso das missões vai e volta do save', () => {
  const inv = criarInventario();
  const ms = criarMissoes({ m: 3, p: 1, n: 2, pegos: ['fusivel:0', 'fusivel:2'], sistemas: [['energia', 1], ['casco', 1], ['motor', 1]], combustivel: 0, porta: false }, inv);
  const s = validarSave(JSON.parse(JSON.stringify(montarSave({ inventario: [], blocos: [], fogueiras: [], missao: ms.serializar() }))));
  assert.deepEqual(s.missao.pegos, ['fusivel:0', 'fusivel:2']);
  assert.equal(s.missao.m, 3);
  const de_novo = criarMissoes(s.missao, inv);
  assert.equal(de_novo.passo().tipo, 'achar');
  assert.equal(de_novo.progresso(), '⚡ 2/3');
  assert.equal(validarSave({ ...s, missao: { m: 'x' } }).missao, null);
});
