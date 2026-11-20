// Teste de fumaça: abre o jogo num navegador de verdade (Chromium do Playwright), deitado como iPhone e como iPad,
// com toque, e confere o básico: carrega sem erro, o joystick anda, arrastar olha, o botão de atirar atira
// (e mira ao arrastar), pular pula, pausar pausa, e o celular em pé pede para girar.
//
// Uso:  node tests/fumaca.mjs [pasta-para-as-capturas]
// Não substitui o teste no iPad/iPhone de verdade (o Safari usa outro motor).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pastaCapturas = resolve(process.argv[2] || join(tmpdir(), 'rumo-a-terra-capturas'));
mkdirSync(pastaCapturas, { recursive: true });

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json' };
const servidor = createServer(async (req, res) => {
  try {
    const caminho = join(raiz, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!caminho.startsWith(raiz)) throw new Error('fora');
    const corpo = await readFile(caminho.endsWith('/') ? join(caminho, 'index.html') : caminho);
    res.writeHead(200, { 'content-type': TIPOS[extname(caminho)] || 'application/octet-stream' });
    res.end(corpo);
  } catch { res.writeHead(404); res.end('não achei'); }
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}/index.html`;

const falhas = [];
const conferir = (ok, texto) => { console.log(`${ok ? 'ok  ' : 'FALHOU'} ${texto}`); if (!ok) falhas.push(texto); };
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const navegador = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'] });

async function testar(nome, largura, altura) {
  console.log(`\n== ${nome} (${largura}x${altura}, toque)`);
  const ctx = await navegador.newContext({ viewport: { width: largura, height: altura }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  const cdp = await ctx.newCDPSession(page);
  const toque = (type, pontos) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pontos.map(([x, y, id]) => ({ x, y, id })) });
  const estado = () => page.evaluate(() => {
    const r = window.__rumo;
    return { estado: r.estado, x: r.jogador.pos.x, y: r.jogador.pos.y, z: r.jogador.pos.z, rumo: r.jogador.rumo, inclinacao: r.jogador.inclinacao, estourados: r.alvos.estourados };
  });

  const t0 = Date.now();
  await page.goto(`${base}?debug=1`);
  await page.waitForFunction(() => window.__rumo && window.__rumo.estado === 'inicio', null, { timeout: 60000 });
  conferir(true, `carregou em ${Date.now() - t0} ms`);
  await page.screenshot({ path: join(pastaCapturas, `${nome}-menu.png`) });

  // Novo jogo (toque de verdade no botão): abertura no espaço, pular, acordar no Vale
  conferir(!(await page.locator('#btn-continuar-jogo').isVisible()), 'sem jogo salvo, o menu não mostra "Continuar"');
  const novo = await page.locator('#btn-novo-jogo').boundingBox();
  await page.touchscreen.tap(novo.x + novo.width / 2, novo.y + novo.height / 2);
  await esperar(400);
  conferir((await estado()).estado === 'prologo' && await page.locator('#prologo').isVisible(), '"Novo jogo" começa a abertura no espaço');
  await esperar(2500);
  await page.screenshot({ path: join(pastaCapturas, `${nome}-abertura.png`) });
  const pular = await page.locator('#btn-pular-prologo').boundingBox();
  await page.touchscreen.tap(pular.x + pular.width / 2, pular.y + pular.height / 2);
  await page.waitForFunction(() => window.__rumo.estado === 'jogando', null, { timeout: 8000 });
  conferir((await estado()).estado === 'jogando', '"Pular" vai para o Vale da Queda');
  await esperar(3300); // tempo de "acordar"

  // Joystick: dedão esquerdo empurrado para cima = andar para a frente
  let a = await estado();
  const jx = largura * 0.18, jy = altura * 0.7;
  await toque('touchStart', [[jx, jy, 1]]);
  for (let i = 1; i <= 6; i++) { await toque('touchMove', [[jx, jy - i * 12, 1]]); await esperar(30); }
  await esperar(1200);
  await toque('touchEnd', []);
  let b = await estado();
  const andou = Math.hypot(b.x - a.x, b.z - a.z);
  const frenteX = Math.sin(a.rumo), frenteZ = -Math.cos(a.rumo);
  const naFrente = ((b.x - a.x) * frenteX + (b.z - a.z) * frenteZ) / (andou || 1);
  conferir(andou > 2 && naFrente > 0.9, `joystick anda para a frente (${andou.toFixed(1)} m)`);
  await esperar(300);
  const parado = await estado();
  await esperar(300);
  conferir(Math.hypot((await estado()).x - parado.x, (await estado()).z - parado.z) < 0.05, 'soltar o joystick para');

  // Olhar: arrastar na metade direita
  a = await estado();
  const ox = largura * 0.65, oy = altura * 0.45;
  await toque('touchStart', [[ox, oy, 2]]);
  for (let i = 1; i <= 8; i++) { await toque('touchMove', [[ox + i * 10, oy - i * 3, 2]]); await esperar(16); }
  await toque('touchEnd', []);
  await esperar(100);
  b = await estado();
  conferir(b.rumo > a.rumo + 0.1 && b.inclinacao > a.inclinacao, 'arrastar à direita/para cima gira a câmera');

  // Andar e olhar ao mesmo tempo (dois dedos)
  a = await estado();
  await toque('touchStart', [[jx, jy, 3]]);
  await toque('touchStart', [[jx, jy, 3], [ox, oy, 4]]);
  for (let i = 1; i <= 8; i++) { await toque('touchMove', [[jx, jy - 60, 3], [ox - i * 8, oy, 4]]); await esperar(40); }
  await esperar(500);
  await toque('touchEnd', []);
  b = await estado();
  conferir(Math.hypot(b.x - a.x, b.z - a.z) > 1 && b.rumo < a.rumo - 0.05, 'dois dedos: anda e olha ao mesmo tempo');

  // Mirar num alvo e atirar segurando o botão
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador, alvo = r.alvos.lista[0];
    j.pos.set(alvo.base.x + 6, j.pos.y, alvo.base.z + 6);
    j.pos.y = j.pos.y; // a física acerta a altura no próximo passo
  });
  await esperar(300);
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador, alvo = r.alvos.lista[0];
    const dx = alvo.pos.x - j.pos.x, dz = alvo.pos.z - j.pos.z, dy = alvo.pos.y - (j.pos.y + 1.62);
    j.girar(Math.atan2(dx, -dz) - j.rumo, Math.atan2(dy, Math.hypot(dx, dz)) - j.inclinacao);
  });
  await esperar(200);
  const btn = await page.locator('#btn-atirar').boundingBox();
  const bx = btn.x + btn.width / 2, by = btn.y + btn.height / 2;
  a = await estado();
  await toque('touchStart', [[bx, by, 5]]);
  await esperar(900);
  const calor = await page.evaluate(() => getComputedStyle(document.getElementById('calor')).opacity);
  await page.screenshot({ path: join(pastaCapturas, `${nome}-atirando.png`) });
  // arrastar em cima do botão de atirar também mira
  for (let i = 1; i <= 6; i++) { await toque('touchMove', [[bx - i * 10, by, 5]]); await esperar(16); }
  await toque('touchEnd', []);
  await esperar(1500);
  b = await estado();
  conferir(Number(calor) > 0, 'segurar o botão atira (a arma esquenta)');
  conferir(b.estourados > a.estourados, `o tiro estoura a bolha de treino (${b.estourados})`);
  conferir(b.rumo < a.rumo - 0.05, 'arrastar o dedo no botão de atirar também mira');

  // Pular
  a = await estado();
  const pulo = await page.locator('#btn-pular').boundingBox();
  await toque('touchStart', [[pulo.x + pulo.width / 2, pulo.y + pulo.height / 2, 6]]);
  await toque('touchEnd', []);
  let maiorY = a.y;
  for (let i = 0; i < 8; i++) { await esperar(50); maiorY = Math.max(maiorY, (await estado()).y); }
  conferir(maiorY > a.y + 0.5, `pular sobe (${(maiorY - a.y).toFixed(2)} m)`);

  // Ação perto da porta da nave
  await page.evaluate(() => { const r = window.__rumo, p = r.nave.porta; r.jogador.pos.set(p.x, r.jogador.pos.y, p.z); });
  await esperar(400);
  conferir(await page.locator('#btn-acao').isVisible(), 'perto da porta aparece o botão "Examinar"');

  // Pausar e continuar
  const pausa = await page.locator('#btn-pausar').boundingBox();
  await page.touchscreen.tap(pausa.x + pausa.width / 2, pausa.y + pausa.height / 2);
  await esperar(300);
  conferir((await estado()).estado === 'pausa' && await page.locator('#tela-pausa').isVisible(), 'botão de pausa pausa');
  const cont = await page.locator('#btn-continuar').boundingBox();
  await page.touchscreen.tap(cont.x + cont.width / 2, cont.y + cont.height / 2);
  await esperar(300);
  conferir((await estado()).estado === 'jogando', 'continuar volta ao jogo');

  // Celular em pé: pede para girar e pausa
  await page.setViewportSize({ width: altura, height: largura });
  await esperar(400);
  conferir(await page.locator('#tela-girar').isVisible() && (await estado()).estado === 'pausa', 'em pé aparece "Gire o aparelho" e o jogo pausa');
  await page.setViewportSize({ width: largura, height: altura });
  await esperar(400);
  conferir(!(await page.locator('#tela-girar').isVisible()), 'deitado de novo, o aviso some');

  // Os dois visuais carregam
  for (const v of ['liso', 'pixelado']) {
    await page.evaluate((x) => { window.__rumo.aplicarVisual(x); }, v);
    await page.evaluate(() => { document.getElementById('btn-continuar').click(); });
    await esperar(500);
    await page.screenshot({ path: join(pastaCapturas, `${nome}-${v}.png`) });
  }

  if (nome === 'iphone') await testarColeta(page, toque, conferir, nome);
  if (nome === 'ipad') await testarAliensMapaVolta(page, toque, conferir, nome);

  conferir(erros.length === 0, `sem erros no console${erros.length ? ': ' + erros.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}

// Coleta e criação: cortar árvore segurando a ação, criar pela mochila, colocar blocos, subir neles, salvar.
async function testarColeta(page, toque, conferir, nome) {
  console.log('-- coleta e criação');
  const centro = async (sel) => { const l = page.locator(sel); await l.scrollIntoViewIfNeeded(); const b = await l.boundingBox(); return [b.x + b.width / 2, b.y + b.height / 2]; };
  const tocar = async (sel) => { const [x, y] = await centro(sel); await page.touchscreen.tap(x, y); await esperar(250); };
  // vai até a árvore mais perto e mira no tronco
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador;
    const arvores = r.recursos.lista.filter((x) => x.tipo === 'arvore' && x.estado === 'inteiro');
    arvores.sort((a, b) => Math.hypot(a.x - j.pos.x, a.z - j.pos.z) - Math.hypot(b.x - j.pos.x, b.z - j.pos.z));
    const a = arvores[0];
    window.__arvore = a;
    j.pos.set(a.x + 1.6, a.y + 0.2, a.z);
  });
  await esperar(400);
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador, a = window.__arvore;
    const dx = a.x - j.pos.x, dz = a.z - j.pos.z, dy = a.y + 1.0 - (j.pos.y + 1.62);
    j.girar(Math.atan2(dx, -dz) - j.rumo, Math.atan2(dy, Math.hypot(dx, dz)) - j.inclinacao);
  });
  await esperar(300);
  conferir((await page.locator('#btn-acao-texto').textContent()) === 'Cortar', 'mirando no tronco aparece "Cortar"');
  const [ax, ay] = await centro('#btn-acao');
  await toque('touchStart', [[ax, ay, 9]]);
  await esperar(3800);
  await toque('touchEnd', []);
  await esperar(1500);
  const madeira = await page.evaluate(() => window.__rumo.inventario.quantos('madeira'));
  conferir(madeira >= 3 && await page.evaluate(() => window.__arvore.estado !== 'inteiro'), `segurar a ação corta a árvore e a madeira vem para a mochila (${madeira})`);
  await page.screenshot({ path: join(pastaCapturas, `${nome}-coleta.png`) });

  // criar machado pela tela da mochila
  await page.evaluate(() => { const i = window.__rumo.inventario; i.adicionar('pedra', 5); i.adicionar('fibra', 2); i.adicionar('madeira', 4); });
  await tocar('#btn-mochila');
  conferir(await page.locator('#tela-mochila').isVisible(), 'a mochila abre (e o jogo pausa)');
  await page.screenshot({ path: join(pastaCapturas, `${nome}-mochila.png`) });
  await tocar('#aba-criar');
  await tocar('button[data-receita="machado"]');
  await tocar('button[data-receita="bloco_madeira"]');
  await tocar('button[data-receita="bloco_madeira"]');
  await page.screenshot({ path: join(pastaCapturas, `${nome}-criar.png`) });
  const tem = await page.evaluate(() => ({ machado: window.__rumo.inventario.quantos('machado'), blocos: window.__rumo.inventario.quantos('bloco_madeira') }));
  conferir(tem.machado === 1 && tem.blocos === 4, `criar machado e blocos pela tela (machado ${tem.machado}, blocos ${tem.blocos})`);

  // colocar blocos: aba Mochila -> Colocar -> mirar no chão -> Colocar
  await tocar('#aba-mochila');
  await tocar('button[data-item="bloco_madeira"]');
  conferir(await page.locator('#modo-colocar').isVisible(), 'tocar em "Colocar" volta ao jogo no modo de colocar');
  await page.evaluate(() => { const j = window.__rumo.jogador; j.girar(0, -0.75 - j.inclinacao); });
  await esperar(300);
  const antes = await page.evaluate(() => window.__rumo.construcoes.total);
  await tocar('#btn-acao');
  await esperar(200);
  // mira no topo do bloco que acabou de pôr (para o próximo ir em cima dele)
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador, b = r.construcoes.listaBlocos().at(-1);
    const alvo = { x: b.i + 0.5, y: b.base + 1, z: b.j + 0.5 };
    const dx = alvo.x - j.pos.x, dz = alvo.z - j.pos.z, dy = alvo.y - (j.pos.y + 1.62);
    j.girar(Math.atan2(dx, -dz) - j.rumo, Math.atan2(dy, Math.hypot(dx, dz)) - j.inclinacao);
  });
  await esperar(250);
  await tocar('#btn-acao');
  const depois = await page.evaluate(() => window.__rumo.construcoes.total);
  conferir(depois >= antes + 2, `blocos colocados (${depois - antes}), o segundo em cima do primeiro`);
  await page.evaluate(() => { const j = window.__rumo.jogador; j.girar(0, 0.35 - j.inclinacao); });
  await esperar(400);
  await page.screenshot({ path: join(pastaCapturas, `${nome}-blocos.png`) });
  // subir nos blocos: põe o jogador em cima e deixa cair
  const subiu = await page.evaluate(async () => {
    const r = window.__rumo, b = r.construcoes.serializar().blocos.at(-1);
    r.jogador.pos.set(b[1] + 0.5, b[3] / 100 + 3, b[2] + 0.5);
    await new Promise((ok) => setTimeout(ok, 1200));
    return { y: r.jogador.pos.y, topo: b[3] / 100 + 1 };
  });
  conferir(Math.abs(subiu.y - subiu.topo) < 0.05, `dá para ficar em pé em cima do bloco (y ${subiu.y.toFixed(2)}, topo ${subiu.topo.toFixed(2)})`);

  // salvar e recarregar: aparece "Continuar", e tudo volta (inclusive onde o jogador estava)
  await tocar('#btn-cancelar');
  await page.evaluate(() => { const j = window.__rumo.jogador; j.pos.set(30, j.pos.y, 25); });
  await esperar(300);
  await page.evaluate(() => { window.__rumo.inventario.adicionar('madeira', 1); window.__rumo.salvarAgora(); });
  const guardado = await page.evaluate(() => ({ madeira: window.__rumo.inventario.quantos('madeira'), total: window.__rumo.construcoes.total, x: window.__rumo.jogador.pos.x }));
  await page.reload();
  await page.waitForFunction(() => window.__rumo && window.__rumo.estado === 'inicio', null, { timeout: 60000 });
  conferir(await page.locator('#btn-continuar-jogo').isVisible(), 'com jogo salvo, o menu mostra "Continuar"');
  await tocar('#btn-continuar-jogo');
  const voltou = await page.evaluate(() => ({ estado: window.__rumo.estado, madeira: window.__rumo.inventario.quantos('madeira'), total: window.__rumo.construcoes.total, machado: window.__rumo.inventario.quantos('machado'), x: window.__rumo.jogador.pos.x }));
  conferir(voltou.estado === 'jogando' && voltou.madeira === guardado.madeira && voltou.total === guardado.total && voltou.machado === 1 && Math.abs(voltou.x - guardado.x) < 0.2,
    '"Continuar" volta com a mochila, os blocos e no mesmo lugar');

  // Novo jogo de novo: pede confirmação e apaga tudo
  await tocar('#btn-pausar');
  await tocar('#btn-sair');
  await tocar('#btn-novo-jogo');
  conferir(await page.locator('#confirmar-novo').isVisible(), 'com jogo salvo, "Novo jogo" pede confirmação');
  await tocar('#btn-confirmar-novo');
  const zerou = await page.evaluate(() => ({ estado: window.__rumo.estado, itens: window.__rumo.inventario.lista().length, total: window.__rumo.construcoes.total, salvo: localStorage.getItem('rumo-a-terra:save:1') }));
  conferir(zerou.estado === 'prologo' && zerou.itens === 0 && zerou.total === 0 && zerou.salvo === null, 'confirmar começa do zero (mochila e construções apagadas) e mostra a abertura');
  await tocar('#btn-pular-prologo');
  await page.waitForFunction(() => window.__rumo.estado === 'jogando', null, { timeout: 8000 });
}

// Aliens (atirar até cair, levar mordida, desmaiar), mapa e dar a volta no mundo.
async function testarAliensMapaVolta(page, toque, conferir, nome) {
  console.log('-- aliens, mapa e a volta no mundo');
  const centro = async (sel) => { const l = page.locator(sel); await l.scrollIntoViewIfNeeded(); const b = await l.boundingBox(); return [b.x + b.width / 2, b.y + b.height / 2]; };
  const tocar = async (sel) => { const [x, y] = await centro(sel); await page.touchscreen.tap(x, y); await esperar(300); };

  // um Rastejador parado na frente, a 6 m: segurar o tiro até ele cair e deixar carne
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador;
    j.pos.set(60, 0, 60); j.pos.y = r.grade.alturaEm(60, 60);
    const c = r.criaturas.lista.find((x) => x.tipo === 'rastejador' && x.vivo);
    window.__bicho = c;
    c.pos.set(60, 0, 54); c.pos.y = r.grade.alturaEm(60, 54);
    c.d = { ...c.d, visao: 0 }; c.estado = 'passeando'; c.casa.set(60, 0, 54); c.alvoX = 60; c.alvoZ = 54; c.espera = 99;
  });
  await esperar(300);
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador, c = window.__bicho;
    const dx = c.pos.x - j.pos.x, dz = c.pos.z - j.pos.z, dy = c.pos.y + 0.6 - (j.pos.y + 1.62);
    j.girar(Math.atan2(dx, -dz) - j.rumo, Math.atan2(dy, Math.hypot(dx, dz)) - j.inclinacao);
  });
  const carneAntes = await page.evaluate(() => window.__rumo.inventario.quantos('carne'));
  const [bx, by] = await centro('#btn-atirar');
  await toque('touchStart', [[bx, by, 21]]);
  await esperar(1600);
  await toque('touchEnd', []);
  await esperar(2800);
  const r1 = await page.evaluate(() => ({ vivo: window.__bicho.vivo, carne: window.__rumo.inventario.quantos('carne') }));
  conferir(!r1.vivo && r1.carne > carneAntes, `atirar no Rastejador: ele cai, some e deixa carne (${r1.carne})`);

  // levar mordida e desmaiar
  const vidaAntes = await page.evaluate(() => window.__rumo.vida);
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador;
    const c = r.criaturas.lista.find((x) => x.tipo === 'rastejador' && x.vivo);
    window.__bicho2 = c;
    c.d = { ...c.d, visao: 30 };
    c.pos.set(j.pos.x + 1.5, 0, j.pos.z); c.pos.y = r.grade.alturaEm(c.pos.x, c.pos.z);
    c.estado = 'cacando'; c.recarga = 0;
  });
  await esperar(1500);
  const vidaDepois = await page.evaluate(() => window.__rumo.vida);
  conferir(vidaDepois < vidaAntes, `a mordida do Rastejador tira vida (${Math.round(vidaAntes)} → ${Math.round(vidaDepois)})`);
  await page.screenshot({ path: join(pastaCapturas, `${nome}-mordida.png`) });
  await page.evaluate(() => window.__rumo.levarDano(200));
  await esperar(2200);
  const r2 = await page.evaluate(() => { const r = window.__rumo; return { vida: r.vida, dNave: Math.hypot(r.jogador.pos.x - r.nave.centro.x, r.jogador.pos.z - r.nave.centro.z) }; });
  conferir(r2.vida === 100 && r2.dNave < 12, `vida zerada: desmaia e acorda na nave com a vida cheia (a ${r2.dNave.toFixed(1)} m da nave)`);
  await esperar(3500);

  // mapa pelo botão do canto
  await tocar('#btn-mapa');
  conferir(await page.locator('#tela-mapa').isVisible() && await page.evaluate(() => window.__rumo.estado) === 'mapa', 'o botão 🗺️ abre o mapa (e pausa)');
  await page.screenshot({ path: join(pastaCapturas, `${nome}-mapa.png`) });
  await tocar('#btn-fechar-mapa');
  conferir(await page.evaluate(() => window.__rumo.estado) === 'jogando', 'fechar o mapa volta ao jogo');

  // dar a volta: perto da borda leste, andar para o leste e aparecer do outro lado
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador;
    j.reposicionar(253, 30, 90);
    for (const c of r.criaturas.lista) c.d = { ...c.d, visao: 0, dano: 0 };
  });
  await esperar(300);
  const [jx, jy] = [1180 * 0.18, 820 * 0.7];
  await toque('touchStart', [[jx, jy, 22]]);
  for (let i = 1; i <= 6; i++) { await toque('touchMove', [[jx, jy - i * 12, 22]]); await esperar(30); }
  await esperar(1600);
  await toque('touchEnd', []);
  const r3 = await page.evaluate(() => { const r = window.__rumo, j = r.jogador; return { x: j.pos.x, y: j.pos.y, chao: r.grade.alturaEm(j.pos.x, j.pos.z) }; });
  conferir(r3.x < -240 && Math.abs(r3.y - r3.chao) < 0.6, `passando da borda leste, aparece do lado oeste, no chão (x ${r3.x.toFixed(1)})`);
  await page.screenshot({ path: join(pastaCapturas, `${nome}-emenda.png`) });
}

async function testarComputador() {
  console.log('\n== computador (1280x720, teclado e mouse)');
  const ctx = await navegador.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  await page.goto(`${base}?debug=1`);
  await page.waitForFunction(() => window.__rumo && window.__rumo.estado === 'inicio', null, { timeout: 60000 });
  await page.click('#btn-novo-jogo');
  await esperar(300);
  await page.click('#btn-pular-prologo');
  await page.waitForFunction(() => window.__rumo.estado === 'jogando', null, { timeout: 8000 });
  await esperar(3300);
  conferir(!(await page.locator('#btn-atirar').isVisible()), 'sem toque, os botões de toque ficam escondidos');
  const pos = () => page.evaluate(() => ({ x: window.__rumo.jogador.pos.x, z: window.__rumo.jogador.pos.z }));
  const a = await pos();
  await page.keyboard.down('KeyW');
  await esperar(1000);
  await page.keyboard.up('KeyW');
  const b = await pos();
  conferir(Math.hypot(b.x - a.x, b.z - a.z) > 2, 'W anda para a frente');
  await page.evaluate(() => { const r = window.__rumo, p = r.nave.porta; r.jogador.pos.set(p.x, r.jogador.pos.y, p.z); });
  await esperar(300);
  conferir((await page.locator('#btn-acao-texto').textContent()).startsWith('E:'), 'perto da porta aparece "E: Examinar"');
  await page.keyboard.press('Escape');
  await esperar(200);
  conferir(await page.evaluate(() => window.__rumo.estado) === 'pausa', 'Esc pausa');
  conferir(erros.length === 0, `sem erros no console${erros.length ? ': ' + erros.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}

try {
  await testar('iphone', 844, 390);
  await testar('ipad', 1180, 820);
  await testarComputador();
} finally {
  await navegador.close();
  servidor.close();
}
console.log(`\nCapturas em ${pastaCapturas}`);
if (falhas.length) { console.log(`\n${falhas.length} falha(s).`); process.exit(1); }
console.log('\nTudo certo no teste de fumaça.');
