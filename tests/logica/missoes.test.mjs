import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarMissoes } from '../../src/logica/missoes.js';
import { criarInventario } from '../../src/logica/inventario.js';
import { MISSOES, SISTEMAS, VERSAO_CAMPANHA } from '../../src/dados/missoes.js';
import { LOCAIS, PONTOS, SEGREDOS, PECAS_NO_LOCAL, CHEFE_NO_LOCAL } from '../../src/dados/locais.js';
import { ITENS } from '../../src/dados/itens.js';
import { CRIATURAS } from '../../src/dados/criaturas.js';
import { montarSave, validarSave } from '../../src/logica/save.js';

const ctx = (local = null, fogueira = false) => ({ pertoDe: (l) => l === local, fogueiraPertoDaNave: fogueira });

test('a campanha é curta e cada peça tem um chefe', () => {
  const passos = MISSOES.reduce((s, m) => s + m.passos.length, 0);
  assert.ok(MISSOES.length <= 8 && passos <= 32, `${MISSOES.length} missões, ${passos} passos`);
  for (const m of MISSOES) {
    if (m.sistema) assert.ok(SISTEMAS.some((s) => s.id === m.sistema), m.id);
    const pega = m.passos.findIndex((p) => p.tipo === 'pegar');
    if (pega >= 0) {
      const chefe = m.passos.slice(0, pega).find((p) => p.tipo === 'chefe');
      assert.ok(chefe, `${m.id}: tem um chefe antes de pegar a peça`);
      assert.ok(CRIATURAS[chefe.chefe] && CRIATURAS[chefe.chefe].chefe, `${m.id}: chefe ${chefe.chefe}`);
      assert.ok(CHEFE_NO_LOCAL[chefe.chefe], `${m.id}: onde o chefe aparece`);
      assert.ok(PECAS_NO_LOCAL[m.passos[pega].item], `${m.id}: onde a peça aparece`);
    }
    for (const p of m.passos) {
      if (p.local) assert.ok(LOCAIS[p.local], `${m.id}: local ${p.local}`);
      if (p.item) assert.ok(ITENS[p.item], `${m.id}: item ${p.item}`);
      if (p.tipo === 'achar') assert.ok(PONTOS[p.item], `${m.id}: pontos de ${p.item}`);
      for (const id of Object.keys(p.itens || p.precisa || {})) assert.ok(ITENS[id], `${m.id}: ${id}`);
      assert.ok(p.texto && p.texto.length < 140, `${m.id}: texto curto`);
    }
  }
  const chefes = new Set(MISSOES.flatMap((m) => m.passos.filter((p) => p.tipo === 'chefe').map((p) => p.chefe)));
  assert.equal(chefes.size, 6, 'seis chefes diferentes');
});

test('dá para jogar a campanha inteira, do começo ao fim', () => {
  const inv = criarInventario();
  const ms = criarMissoes(null, inv);
  let voltas = 0;
  while (!ms.fim && voltas++ < 100) {
    const ps = ms.passo();
    if (ps.tipo === 'falar') ms.evento('falou');
    else if (ps.tipo === 'ir') ms.verificar(0.1, ctx(ps.local));
    else if (ps.tipo === 'chefe') ms.evento('derrotou', { tag: ms.tag() });
    else if (ps.tipo === 'pegar') { inv.adicionar(ps.item, 1); ms.evento('pegou', { id: ps.item }); }
    else if (ps.tipo === 'instalar') assert.ok(ms.instalar(), `instalar ${ms.missao().id}`);
    else if (ps.tipo === 'abrir') ms.evento('abriu');
    else if (ps.tipo === 'decolar') ms.evento('decolou');
    else assert.fail(`passo inesperado: ${ps.tipo}`);
  }
  assert.ok(ms.fim, 'chegou ao fim');
  for (const s of SISTEMAS) assert.equal(ms.estado.sistemas[s.id], s.etapas, s.id);
  assert.equal(ms.estado.porta, true);
});

test('o chefe certo é que conta (bichos de outros passos não)', () => {
  const ms = criarMissoes(null, criarInventario());
  ms.evento('falou');
  ms.verificar(0.1, ctx('colina'));
  assert.equal(ms.passo().tipo, 'chefe');
  ms.evento('derrotou', { tag: 'ajudante' });
  ms.evento('derrotou', { tag: 'outro:2' });
  assert.equal(ms.passo().tipo, 'chefe');
  ms.evento('derrotou', { tag: ms.tag() });
  assert.equal(ms.passo().tipo, 'pegar');
});

test('o progresso das missões e os segredos vão e voltam do save', () => {
  const inv = criarInventario();
  const ms = criarMissoes({ v: VERSAO_CAMPANHA, m: 2, p: 1, n: 0, pegos: [], sistemas: [['energia', 1], ['motor', 1]], combustivel: 0, porta: false }, inv);
  const s = validarSave(JSON.parse(JSON.stringify(montarSave({ inventario: [], blocos: [], fogueiras: [], missao: ms.serializar(), segredos: ['gravador2', 'monolito1', 'inventado'] }))));
  assert.equal(s.missao.m, 2);
  assert.deepEqual(s.segredos, ['gravador2', 'monolito1']);
  assert.equal(criarMissoes(s.missao, inv).missao().id, 'antena');
  // save da campanha antiga (12 missões, sem "v"): a campanha recomeça, o resto continua
  const antigo = validarSave({ ...s, missao: { m: 9, p: 0, n: 0, pegos: [], sistemas: [], combustivel: 0, porta: false } });
  assert.equal(antigo.missao, null);
});

test('os segredos são escondidos e cada um tem lugar e mensagem', () => {
  assert.ok(SEGREDOS.length >= 5);
  for (const sg of SEGREDOS) {
    assert.ok(sg.msgs && sg.msgs.length, sg.id);
    if (sg.tipo === 'monolitos') for (const id of sg.toques) assert.ok(LOCAIS[id], id);
    else assert.ok(Number.isFinite(sg.x) && Number.isFinite(sg.z), sg.id);
    if (sg.item) assert.ok(ITENS[sg.item], sg.item);
  }
});

test('receitas sem "desde" aparecem sempre', () => {
  const ms = criarMissoes(null, criarInventario());
  assert.equal(ms.receitaLiberada({}), true);
});
